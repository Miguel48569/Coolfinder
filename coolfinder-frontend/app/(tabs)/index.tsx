import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import {
  LojaService,
  type Loja,
  type ApiError,
} from "../../services/LojaService";

export default function ListaLojas() {
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObjectCoords | null>(null);

  const carregarLojas = async () => {
    try {
      setError(null);
      const lojasData = await LojaService.listarLojas();
      setLojas(lojasData);
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.isNetworkError
        ? "Não foi possível carregar as lojas. Verifique sua conexão com a internet."
        : apiError.message;

      setError(errorMessage);
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    carregarLojas();
  }, []);

  useEffect(() => {
    carregarLojas();
    obterLocalizacaoUsuario();
  }, []);

  const obterLocalizacaoUsuario = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissão de localização negada");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    } catch (error) {
      console.error("Erro ao obter localização:", error);
    }
  };

  const calcularDistancia = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): string | null => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;

    const R = 6371; // Raio da Terra em km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d.toFixed(2);
  };

  const renderItem = ({ item }: { item: Loja }) => {
    const distancia = userLocation
      ? calcularDistancia(
          userLocation.latitude,
          userLocation.longitude,
          item.latitude,
          item.longitude
        )
      : null;

    return (
      <View style={styles.card}>
        <Image
          source={{ uri: `data:image/jpeg;base64,${item.foto}` }}
          style={styles.foto}
        />
        <View style={styles.info}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.endereco}>{item.endereco}</Text>
          <Text style={styles.coordenadas}>
            Lat: {item.latitude.toFixed(6)}, Long: {item.longitude.toFixed(6)}
          </Text>
          {distancia && (
            <Text style={styles.distancia}>Distância: {distancia} km</Text>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={carregarLojas}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={lojas}
        renderItem={renderItem}
        keyExtractor={(item) => item._id || item.nome}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma loja cadastrada ainda.</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  foto: {
    width: "100%",
    height: 200,
  },
  info: {
    padding: 16,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  endereco: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  coordenadas: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  distancia: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
