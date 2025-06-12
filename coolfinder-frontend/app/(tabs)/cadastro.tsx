import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { LojaService } from "../../services/LojaService";
import { router } from "expo-router";

interface CadastroState {
  nome: string;
  endereco: string;
  latitude: number | null;
  longitude: number | null;
  foto: string | null;
}

export default function CadastroLoja() {
  const [dados, setDados] = React.useState<CadastroState>({
    nome: "",
    endereco: "",
    latitude: null,
    longitude: null,
    foto: null,
  });
  const [loading, setLoading] = React.useState(false);

  const pegarLocalizacao = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erro", "Permissão de localização negada");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setDados((prevState) => ({
        ...prevState,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));
      Alert.alert("Sucesso", "Localização capturada com sucesso!");
    } catch (error) {
      console.error("Erro ao obter localização:", error);
      Alert.alert("Erro", "Não foi possível obter a localização");
    } finally {
      setLoading(false);
    }
  };

  const tirarFoto = async () => {
    try {
      setLoading(true);
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erro", "Permissão da câmera negada");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      const base64Image = result.assets?.[0]?.base64;
      if (!result.canceled && base64Image) {
        setDados((prevState) => ({
          ...prevState,
          foto: base64Image,
        }));
        Alert.alert("Sucesso", "Foto capturada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao tirar foto:", error);
      Alert.alert("Erro", "Não foi possível tirar a foto");
    } finally {
      setLoading(false);
    }
  };

  const salvarLoja = async () => {
    try {
      if (!dados.nome.trim()) {
        Alert.alert("Erro", "Por favor, insira o nome da loja");
        return;
      }

      if (!dados.endereco.trim()) {
        Alert.alert("Erro", "Por favor, insira o endereço da loja");
        return;
      }

      if (!dados.latitude || !dados.longitude) {
        Alert.alert("Erro", "Por favor, capture a localização da loja");
        return;
      }

      if (!dados.foto) {
        Alert.alert("Erro", "Por favor, tire uma foto da loja");
        return;
      }

      setLoading(true);
      await LojaService.cadastrarLoja({
        nome: dados.nome,
        endereco: dados.endereco,
        latitude: dados.latitude,
        longitude: dados.longitude,
        foto: dados.foto,
      });

      Alert.alert("Sucesso", "Loja cadastrada com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            router.replace("/");
          },
        },
      ]);
    } catch (error) {
      console.error("Erro ao salvar loja:", error);
      Alert.alert("Erro", "Não foi possível salvar a loja");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar Nova Loja</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da Loja"
        value={dados.nome}
        onChangeText={(text) => setDados((prev) => ({ ...prev, nome: text }))}
      />

      <TextInput
        style={styles.input}
        placeholder="Endereço"
        value={dados.endereco}
        onChangeText={(text) =>
          setDados((prev) => ({ ...prev, endereco: text }))
        }
      />

      <TouchableOpacity
        style={styles.button}
        onPress={pegarLocalizacao}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Carregando..." : "Obter Localização"}
        </Text>
      </TouchableOpacity>

      {dados.foto ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${dados.foto}` }}
            style={styles.preview}
          />
          <TouchableOpacity
            style={[styles.button, styles.buttonSuccess]}
            onPress={tirarFoto}
          >
            <Text style={styles.buttonText}>Tirar Nova Foto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={tirarFoto}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Carregando..." : "Tirar Foto"}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, styles.saveButton]}
        onPress={salvarLoja}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Salvando..." : "Salvar Loja"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonSuccess: {
    backgroundColor: "#34C759",
  },
  saveButton: {
    backgroundColor: "#FF9500",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageContainer: {
    marginBottom: 15,
  },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
});
