import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  Alert, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Ícones para dar acabamento

export default function LoginScreen() {
  const [password, setPassword] = useState('');

  // --- LÓGICA DE NAVEGAÇÃO ---

  const handleLogin = () => {
    if (password === '1234') {
      router.push('/estoque'); // Vai para Admin
      setPassword(''); 
    } else {
      Alert.alert("Acesso Negado", "Senha de gerente incorreta.");
    }
  };

  const handleClientAccess = () => {
    router.push('/vitrine'); // Vai para Cliente
  };

  // --- RENDERIZAÇÃO ---

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Círculos decorativos de fundo (Design Moderno) */}
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      <View style={styles.contentContainer}>
        
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="pricetags" size={40} color="#D32F2F" />
          </View>
          <Text style={styles.title}>TechMarket</Text>
          <Text style={styles.subtitle}>Kiosk Solutions</Text>
        </View>

        {/* CARTÃO PRINCIPAL */}
        <View style={styles.card}>
          
          {/* --- OPÇÃO CLIENTE (Destaque Pêssego) --- */}
          <TouchableOpacity 
            style={styles.clientButton} 
            onPress={handleClientAccess}
            activeOpacity={0.8}
          >
            <View style={styles.clientIconBg}>
              <Ionicons name="cart-outline" size={24} color="#D32F2F" />
            </View>
            <View>
              <Text style={styles.clientTitle}>Sou Cliente</Text>
              <Text style={styles.clientSubtitle}>Toque para ver a vitrine</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#D32F2F" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          <View style={styles.divider}>
            <Text style={styles.dividerText}>ÁREA RESTRITA</Text>
          </View>

          {/* --- OPÇÃO GERENTE (Estilo Minimalista) --- */}
          <View style={styles.adminSection}>
            <Text style={styles.label}>Acesso Gerente</Text>
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Digite a senha (1234)"
                placeholderTextColor="#aaa"
                secureTextEntry={true}
                keyboardType="numeric"
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Entrar no Painel</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// --- ESTILOS (Paleta: Creme, Pêssego, Vermelho) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F5', // Creme fundo base
    justifyContent: 'center',
  },
  // Elementos Decorativos de Fundo
  circleTop: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFAD99', // Pêssego
    opacity: 0.2,
  },
  circleBottom: {
    position: 'absolute',
    bottom: -100,
    left: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#D32F2F', // Vermelho
    opacity: 0.05,
  },
  
  contentContainer: {
    padding: 24,
    zIndex: 1,
  },

  // Cabeçalho
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    backgroundColor: '#FFEBE5', // Creme mais escuro/rosado
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#D32F2F', // Vermelho Tech
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 5,
  },

  // Cartão Central
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    // Sombra sofisticada
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },

  // Botão Cliente (Estilo Cartão)
  clientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0ED', // Pêssego bem claro
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFDAC6', // Borda Pêssego
  },
  clientIconBg: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
    marginRight: 15,
  },
  clientTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  clientSubtitle: {
    fontSize: 13,
    color: '#D32F2F', // Texto vermelho suave
  },

  // Divisor
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerText: {
    fontSize: 10,
    color: '#aaa',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    width: '100%',
  },

  // Área Admin
  adminSection: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#D32F2F', // Vermelho forte
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});