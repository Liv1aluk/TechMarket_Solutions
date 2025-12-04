import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { supabase } from "../../lib/supabase";
import { Ionicons } from "@expo/vector-icons"; // Ícones para dar o ar "Tech"

// --- DEFINIÇÃO DE TIPO (Local para evitar erros) ---
interface Product {
  id: number;
  title: string;
  description: string | null;
  price: number;
  image: string | null;
}

export default function VitrineScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. BUSCAR DADOS (READ-ONLY) ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("title", { ascending: true }); // Ordem alfabética

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      console.error("Erro vitrine:", err.message);
      Alert.alert("Erro", "Falha ao carregar o catálogo.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  // --- 2. RENDERIZAÇÃO ---
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8F5" />

      {/* --- CABEÇALHO SOFISTICADO --- */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <View style={styles.iconBg}>
            <Ionicons name="sparkles" size={18} color="#D32F2F" />
          </View>
          <View>
            <Text style={styles.brandName}>TechMarket</Text>
            <Text style={styles.brandSlogan}>Vitrine Digital</Text>
          </View>
        </View>

        {/* Botão Sair (Discreto mas funcional) */}
        <TouchableOpacity 
          style={styles.exitButton} 
          onPress={() => router.replace("/")}
        >
          <Text style={styles.exitText}>Sair</Text>
          <Ionicons name="log-out-outline" size={20} color="#D32F2F" />
        </TouchableOpacity>
      </View>

      {/* --- LISTAGEM DE PRODUTOS --- */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#D32F2F" />
          <Text style={styles.loadingText}>Carregando catálogo...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          
          // Estado Vazio
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="cube-outline" size={60} color="#FFAD99" />
              <Text style={styles.emptyText}>Nosso estoque está sendo atualizado.</Text>
            </View>
          }
          
          // --- CARD DO PRODUTO (DESIGN PREMIUM) ---
          renderItem={({ item }) => (
            <View style={styles.card}>
              
              {/* Área da Imagem */}
              <View style={styles.imageContainer}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.image} />
                ) : (
                  <View style={[styles.image, styles.placeholderImage]}>
                    <Ionicons name="image-outline" size={40} color="#FFAD99" />
                    <Text style={styles.placeholderText}>Sem Foto</Text>
                  </View>
                )}
              </View>

              {/* Área de Informações */}
              <View style={styles.details}>
                <View>
                  <Text style={styles.categoryTag}>Tecnologia</Text>
                  <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.description} numberOfLines={2}>
                    {item.description || "Consulte um vendedor para mais detalhes."}
                  </Text>
                </View>

                {/* Preço e Botão Fake de "Ver" */}
                <View style={styles.footerRow}>
                  <View>
                    <Text style={styles.priceLabel}>A partir de</Text>
                    <Text style={styles.priceValue}>
                      R$ {item.price.toFixed(2).replace(".", ",")}
                    </Text>
                  </View>
                  
                  {/* Elemento decorativo visual */}
                  <View style={styles.iconBadge}>
                    <Ionicons name="arrow-forward" size={20} color="#D32F2F" />
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

// --- 3. ESTILOS (CREME, PÊSSEGO, VERMELHO) ---
const styles = StyleSheet.create({
  // Fundo Creme Sofisticado
  container: { 
    flex: 1, 
    backgroundColor: "#FFF8F5" 
  },
  
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60, // Topo seguro para iPhone/Android modernos
    paddingBottom: 20,
    backgroundColor: "#FFF8F5",
    zIndex: 10,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBg: {
    backgroundColor: '#FFF0ED', // Pêssego bem claro
    padding: 8,
    borderRadius: 12,
  },
  brandName: { 
    fontSize: 20, 
    fontWeight: "800", 
    color: "#D32F2F",
    letterSpacing: -0.5, 
  },
  brandSlogan: { 
    fontSize: 12, 
    color: "#FFAD99", // Pêssego escuro para texto secundário
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1, 
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFDAC6', // Borda Pêssego
  },
  exitText: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 12,
    marginRight: 6,
  },

  // Lista
  listContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 40 
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: 50 
  },

  // --- CARD PREMIUM ---
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginBottom: 20,
    padding: 16,
    flexDirection: "row",
    // Sombra suave e colorida (Vermelha/Laranja)
    shadowColor: "#D32F2F",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4, // Android
    borderWidth: 1,
    borderColor: 'rgba(255, 218, 198, 0.3)', // Borda muito sutil
  },

  // Imagem Quadrada
  imageContainer: {
    width: 110,
    height: 110,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F9F9F9',
    marginRight: 16,
  },
  image: { 
    width: "100%", 
    height: "100%", 
    resizeMode: "cover" 
  },
  placeholderImage: { 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#FFF0ED" // Fundo Pêssego claro
  },
  placeholderText: { 
    fontSize: 10, 
    color: "#FFAD99", 
    marginTop: 4, 
    fontWeight: '600' 
  },

  // Detalhes
  details: { 
    flex: 1, 
    justifyContent: "space-between" 
  },
  categoryTag: {
    fontSize: 10,
    color: '#FFAD99',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#333", 
    lineHeight: 20 
  },
  description: { 
    fontSize: 12, 
    color: "#888", 
    marginTop: 4,
    lineHeight: 16
  },

  // Rodapé do Card (Preço)
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  priceLabel: {
    fontSize: 10,
    color: '#aaa',
  },
  priceValue: { 
    fontSize: 18, 
    fontWeight: "800", 
    color: "#D32F2F", // Vermelho forte para o preço
  },
  iconBadge: {
    backgroundColor: '#FFF0ED',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Estados
  loadingText: { marginTop: 15, color: "#D32F2F", fontWeight: '600' },
  emptyText: { color: "#999", fontSize: 16, marginTop: 15, textAlign: 'center' },
});