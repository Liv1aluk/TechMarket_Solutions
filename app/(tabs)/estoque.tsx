import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// --- TIPO ---
interface Product {
  id: number;
  title: string;
  description: string | null;
  price: number;
  image: string | null;
}

export default function AdminScreen() {
  // --- ESTADOS ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Controle do ID selecionado (Para Edição/Delete)
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Formulário
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  // --- 1. LEITURA (GET) ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      Alert.alert("Erro", "Falha ao carregar estoque.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  // --- 2. ADICIONAR (INSERT) ---
  const handleInsert = async () => {
    if (!title || !price) {
      Alert.alert("Atenção", "Preencha Título e Preço para adicionar.");
      return;
    }

    setLoading(true);
    const productData = {
      title,
      price: parseFloat(price.replace(",", ".")),
      description,
      image,
    };

    const { error } = await supabase.from("products").insert([productData]);
    setLoading(false);

    if (error) {
      Alert.alert("Erro ao Inserir", error.message);
    } else {
      Alert.alert("Sucesso", "Produto Adicionado!");
      clearForm();
      fetchProducts();
    }
  };

  // --- 3. ATUALIZAR (UPDATE) ---
  const handleUpdate = async () => {
    if (!selectedId) {
      Alert.alert("Erro", "Selecione um produto na lista abaixo para editar.");
      return;
    }

    setLoading(true);
    const productData = {
      title,
      price: parseFloat(price.replace(",", ".")),
      description,
      image,
    };

    const { error } = await supabase
      .from("products")
      .update(productData)
      .eq("id", selectedId);

    setLoading(false);

    if (error) {
      Alert.alert("Erro ao Atualizar", error.message);
    } else {
      Alert.alert("Sucesso", "Produto Atualizado!");
      clearForm();
      fetchProducts();
    }
  };

  // --- 4. DELETAR (DELETE) ---
  const handleDelete = async () => {
    if (!selectedId) {
      Alert.alert("Erro", "Selecione um produto para deletar.");
      return;
    }

    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja apagar o produto ID: ${selectedId}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "APAGAR",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            const { error } = await supabase.from("products").delete().eq("id", selectedId);
            setLoading(false);
            
            if (error) Alert.alert("Erro", error.message);
            else {
              Alert.alert("Deletado", "Produto removido com sucesso.");
              clearForm();
              fetchProducts();
            }
          },
        },
      ]
    );
  };

  // --- 5. LIMPAR FORMULÁRIO ---
  const clearForm = () => {
    setSelectedId(null);
    setTitle("");
    setPrice("");
    setDescription("");
    setImage("");
    Keyboard.dismiss();
  };

  // --- AUXILIARES ---
  const handleSelectProduct = (item: Product) => {
    // Preenche o formulário com os dados do item clicado
    setSelectedId(item.id);
    setTitle(item.title);
    setPrice(item.price.toString());
    setDescription(item.description || "");
    setImage(item.image || "");
  };

  const handleLogout = () => {
    router.replace("/");
  };

  // --- RENDERIZAÇÃO ---
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8F5" />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.headerIconBg}>
            <Ionicons name="settings" size={24} color="#D32F2F" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Painel Gerente</Text>
            <Text style={styles.headerSubtitle}>Controle Total</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#D32F2F" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        
        // --- FORMULÁRIO (CABEÇALHO DA LISTA) ---
        ListHeaderComponent={
          <View style={styles.formCard}>
            
            <View style={styles.formHeaderLine} />

            {/* Campo ID (Apenas leitura/visualização) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ID DO PRODUTO (SISTEMA)</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                placeholder="Selecione um produto abaixo..."
                placeholderTextColor="#999"
                value={selectedId ? selectedId.toString() : ""}
                editable={false} // Bloqueado para escrita manual
              />
            </View>

            {/* Campo Título */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>TÍTULO DO PRODUTO</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: iPhone 15 Pro"
                placeholderTextColor="#ccc"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Campo Preço */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PREÇO (R$)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor="#ccc"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>

            {/* Campo Descrição */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>DESCRIÇÃO TÉCNICA</Text>
              <TextInput
                style={styles.input}
                placeholder="Detalhes do produto"
                placeholderTextColor="#ccc"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            {/* Campo Imagem */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>URL DA IMAGEM</Text>
              <TextInput
                style={styles.input}
                placeholder="http://..."
                placeholderTextColor="#ccc"
                value={image}
                onChangeText={setImage}
                autoCapitalize="none"
              />
            </View>

            {/* --- BOTÕES DE AÇÃO (Estilizados no Tema) --- */}
            <View style={styles.actionContainer}>
              
              {/* Botão ADICIONAR (Vermelho Tech - Principal) */}
              <TouchableOpacity 
                style={[styles.fullButton, styles.btnPrimary]} 
                onPress={handleInsert}
              >
                <Ionicons name="add-circle-outline" size={20} color="#FFF" style={{marginRight: 8}} />
                <Text style={styles.btnText}>ADICIONAR PRODUTO</Text>
              </TouchableOpacity>

              {/* Botão ATUALIZAR (Pêssego/Laranja - Atenção) */}
              {selectedId && (
                <TouchableOpacity 
                  style={[styles.fullButton, styles.btnSecondary]} 
                  onPress={handleUpdate}
                >
                  <Ionicons name="sync-outline" size={20} color="#FFF" style={{marginRight: 8}} />
                  <Text style={styles.btnText}>ATUALIZAR DADOS</Text>
                </TouchableOpacity>
              )}

              {/* Botão DELETAR (Vinho Escuro - Perigo) */}
              {selectedId && (
                <TouchableOpacity 
                  style={[styles.fullButton, styles.btnDanger]} 
                  onPress={handleDelete}
                >
                  <Ionicons name="trash-outline" size={20} color="#FFF" style={{marginRight: 8}} />
                  <Text style={styles.btnText}>EXCLUIR REGISTRO</Text>
                </TouchableOpacity>
              )}

              {/* Botão LIMPAR (Neutro) */}
              <TouchableOpacity 
                style={[styles.fullButton, styles.btnNeutral]} 
                onPress={clearForm}
              >
                <Ionicons name="refresh-outline" size={20} color="#555" style={{marginRight: 8}} />
                <Text style={[styles.btnText, { color: '#555' }]}>LIMPAR FORMULÁRIO</Text>
              </TouchableOpacity>
              
            </View>

            <View style={styles.divider}>
              <Text style={styles.dividerText}>LISTA DE PRODUTOS CADASTRADOS</Text>
            </View>
          </View>
        }

        // --- LISTAGEM ABAIXO ---
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => handleSelectProduct(item)} 
            style={[
              styles.listItem, 
              selectedId === item.id && styles.selectedItem // Destaca se estiver selecionado
            ]}
          >
            <View style={styles.listImageContainer}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.listThumb} />
              ) : (
                <View style={[styles.listThumb, styles.placeholderThumb]} />
              )}
            </View>
            
            <View style={styles.listContent}>
              <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.itemPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
              <Text style={styles.itemId}>ID: {item.id}</Text>
            </View>
            
            {selectedId === item.id ? (
              <Ionicons name="checkmark-circle" size={24} color="#D32F2F" />
            ) : (
               <Ionicons name="chevron-forward" size={18} color="#FFAD99" />
            )}
          </TouchableOpacity>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F5" }, // Fundo Creme
  
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#FFDAC6", // Linha pêssego suave
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIconBg: { backgroundColor: '#FFF0ED', padding: 10, borderRadius: 12 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#333", letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 12, color: "#D32F2F", fontWeight: "600", textTransform: "uppercase" },
  logoutButton: { padding: 8, backgroundColor: "#FFF0ED", borderRadius: 20 },

  // Formulário
  formCard: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    padding: 20,
    borderRadius: 20,
    // Sombra suave avermelhada
    shadowColor: "#D32F2F",
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  formHeaderLine: { 
    width: 40, height: 4, backgroundColor: "#D32F2F", borderRadius: 2, marginBottom: 20, alignSelf: 'center' 
  },
  inputGroup: { marginBottom: 16 },
  label: { 
    fontSize: 10, 
    fontWeight: "bold", 
    color: "#D32F2F", // Label em vermelho tech
    marginBottom: 6, 
    textTransform: "uppercase", 
    letterSpacing: 0.5 
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12, // Bordas mais arredondadas
    padding: 14,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
    color: "#333",
  },
  inputDisabled: {
    backgroundColor: "#F5F5F5",
    color: "#888",
    borderColor: "#EEE",
  },

  // Botões Grandes
  actionContainer: { marginTop: 15, gap: 12 },
  fullButton: {
    flexDirection: 'row',
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: {width:0, height:2},
    elevation: 2
  },
  btnText: { fontWeight: "bold", fontSize: 14, letterSpacing: 0.5 },
  
  // Cores da Paleta
  btnPrimary: { backgroundColor: "#D32F2F" }, // Vermelho Brand (Adicionar)
  btnText: { color: "#FFF" }, // Texto branco padrão
  
  btnSecondary: { backgroundColor: "#FF8A65" }, // Pêssego Forte (Atualizar)
  
  btnDanger: { backgroundColor: "#B71C1C" }, // Vermelho Escuro (Deletar)
  
  btnNeutral: { 
    backgroundColor: "#F5F5F5", // Cinza claro (Limpar)
    borderWidth: 1, 
    borderColor: "#E0E0E0" 
  },

  // Divisor
  divider: { 
    marginTop: 30, 
    borderBottomWidth: 1, 
    borderBottomColor: "#FFDAC6", 
    paddingBottom: 10,
    marginBottom: 10
  },
  dividerText: { 
    textAlign: "center", 
    color: "#FFAD99", 
    fontWeight: "bold", 
    fontSize: 11,
    letterSpacing: 1
  },

  // Lista
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  selectedItem: {
    borderColor: "#D32F2F", 
    backgroundColor: "#FFF0ED", // Fundo pêssego bem claro ao selecionar
  },
  listImageContainer: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 15,
  },
  listThumb: { width: 50, height: 50, borderRadius: 10, backgroundColor: '#eee' },
  placeholderThumb: { backgroundColor: "#FFDAC6" },
  
  listContent: { flex: 1 },
  itemTitle: { fontWeight: "bold", color: "#333", fontSize: 15 },
  itemPrice: { color: "#D32F2F", fontWeight: "700", marginTop: 2 },
  itemId: { fontSize: 10, color: "#999", marginTop: 2 },
});