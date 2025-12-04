// app/(tabs)/explore.tsx

import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TextInput, Button, ScrollView, Alert, Keyboard } from 'react-native';
// Importamos novamente nossa instância do Supabase.
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';

export default function ProductManagementScreen() {
  // Estados para cada campo do formulário. Cada um controla um TextInput.
  const [productId, setProductId] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  // Função utilitária para limpar todos os campos do formulário e fechar o teclado.
  const clearForm = () => {
    setProductId('');
    setTitle('');
    setPrice('');
    setDescription('');
    setImage('');
    Keyboard.dismiss();
  };

  // Função para ADICIONAR um novo produto. Corresponde ao "INSERT".
  const handleAddProduct = async () => {
    // Validação simples para garantir que os campos não estão vazios.
    if (!title || !price || !description || !image) {
      Alert.alert('Atenção', 'Preencha todos os campos para adicionar um produto.');
      return;
    }
    // Chamada ao Supabase para inserir um novo registro na tabela 'products'.
    const { error } = await supabase.from('products').insert([
      // O objeto passado deve ter chaves que correspondem aos nomes das colunas da tabela.
      { title, price: parseFloat(price), description, category: 'app-add', image: image }
    ]);
    // Verificamos se houve erro e exibimos um alerta para o usuário.
    if (error) Alert.alert('Erro', error.message);
    else { Alert.alert('Sucesso', 'Produto adicionado!'); clearForm(); }
  };

  // Função para ATUALIZAR um produto existente. Corresponde ao "UPDATE".
  const handleUpdateProduct = async () => {
    if (!productId) { Alert.alert('Atenção', 'Insira o ID do produto para atualizar.'); return; }

    // Objeto dinâmico para enviar apenas os campos que foram preenchidos para atualização.
    const updateObject: { title?: string, price?: number, description?: string, image?: string } = {};
    if (title) updateObject.title = title;
    if (price) updateObject.price = parseFloat(price);
    if (description) updateObject.description = description;
    if (image) updateObject.image = image;
    if (Object.keys(updateObject).length === 0) { Alert.alert('Atenção', 'Preencha pelo menos um campo para atualizar.'); return; }

    // Chamada ao Supabase para atualizar um registro...
    const { error } = await supabase
      .from('products')
      .update(updateObject) // ...passando os novos dados...
      .eq('id', productId); // ...onde a coluna 'id' seja igual ao ID informado.

    if (error) Alert.alert('Erro', error.message);
    else { Alert.alert('Sucesso', 'Produto atualizado!'); clearForm(); }
  };

  // Função para DELETAR um produto. Corresponde ao "DELETE".
  const handleDeleteProduct = async () => {
    if (!productId) { Alert.alert('Atenção', 'Insira o ID do produto para deletar.'); return; }
    // Chamada ao Supabase para deletar um registro...
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId); // ...onde a coluna 'id' seja igual ao ID informado.

    if (error) Alert.alert('Erro', error.message);
    else { Alert.alert('Sucesso', 'Produto deletado!'); clearForm(); }
  };

  function handleback(){
    router.navigate("/")
  }

  return (
    <View style={styles.container}>
      <Button
        title='Index'
        onPress={handleback}
      />
      {/* ScrollView permite que o formulário role em telas menores,
          especialmente com o teclado aberto. */}
      {/* keyboardShouldPersistTaps="handled"
          permite clicar em botões enquanto o teclado está aberto. */}
      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Gerenciar Produtos</Text>
        {/* Cada TextInput está ligado a uma variável de estado e a sua função de atualização. */}
        <TextInput style={styles.input} placeholder="ID do Produto (para Editar/Deletar)"
          value={productId} onChangeText={setProductId} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Título do Produto"
          value={title} onChangeText={setTitle} />
        <TextInput style={styles.input} placeholder="Preço" value={price} onChangeText={setPrice}
          keyboardType="numeric" />
        <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          placeholder="Descrição" value={description} onChangeText={setDescription} multiline />
        <TextInput style={styles.input} placeholder="URL da Imagem do Produto"
          value={image} onChangeText={setImage} keyboardType="url" autoCapitalize="none" />
        <View style={styles.buttonContainer}>
          {/* Cada botão chama a função de manipulação de dados correspondente. */}
          <Button title="Adicionar Produto (INSERT)" onPress={handleAddProduct} />
          <Button title="Atualizar Produto (UPDATE)" onPress={handleUpdateProduct}
            color="#ff8c00" />
          <Button title="Deletar Produto (DELETE)" onPress={handleDeleteProduct}
            color="#dc3545" />
          <Button title="Limpar Formulário" onPress={clearForm} color="gray" />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  form: { padding: 20, flexGrow: 1 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 10,
    borderRadius: 5, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  buttonContainer: { marginTop: 10, gap: 10 },
});
