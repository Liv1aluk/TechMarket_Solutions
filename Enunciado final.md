
---

# Projeto Final: App "TechMarket Kiosk" – Controle de Acesso e Gestão Cloud

## 1. Contexto e Cenário
A "TechMarket Solutions" deseja instalar tablets em suas lojas físicas para dois usos distintos:
1.  **Modo Cliente (Vitrine):** O cliente pode pegar o tablet e visualizar o catálogo de produtos atualizado em tempo real.
2.  **Modo Gerente (Backoffice):** O gerente da loja utiliza o mesmo tablet para cadastrar novos produtos ou alterar preços, mas essa área deve ser protegida para que clientes não baguncem o estoque.

Você deve desenvolver o aplicativo que gerencia esses dois perfis, abandonando dados locais e utilizando o **Supabase** como backend centralizado.

## 2. Estrutura do Aplicativo (3 Telas)

O aplicativo deverá possuir uma navegação (Stack ou Tabs) composta por:

### Tela 1: Acesso (Login)
É a tela inicial do aplicativo (`index.tsx`).
*   Deve conter a logo ou título da loja.
*   Deve oferecer duas opções claras de navegação:
    1.  **"Entrar como Cliente":** Redireciona imediatamente para a Tela de Vitrine.
    2.  **"Área Administrativa":** Deve solicitar uma **Senha de Acesso**.
        *   *Nota:* Para este MVP, você pode definir uma senha fixa no código (ex: `1234`) ou validar contra uma tabela de usuários no Supabase (opcional).
        *   Se a senha estiver correta, redireciona para a Tela de Gerenciamento.
        *   Se incorreta, exibe um alerta de erro.

### Tela 2: Vitrine de Produtos (Modo Leitura)
Acessível ao consumidor final.
*   **Funcionalidade:** Apenas **LEITURA (GET)**.
*   Deve listar todos os produtos do Supabase (Foto, Título e Preço).
*   **Restrição:** Nesta tela **não** devem existir botões de excluir, editar ou adicionar produtos. É apenas para visualização.
*   Deve possuir um botão de "Voltar" ou "Sair" que retorna à Tela de Login.

### Tela 3: Gerenciamento de Estoque (Modo Admin)
Acessível apenas via senha.
*   **Funcionalidade:** **CRUD Completo**.
*   Formulário para Criar (POST) novos produtos.
*   Lista de produtos com opções para Editar (PUT) e Deletar (DELETE).
*   Esta tela é a "painel de controle" do gerente.

---

## 3. Especificações Técnicas

### 3.1. Backend (Supabase)
Mantenha a tabela `products` conforme a aula anterior:
*   `id` (int8), `title` (text), `price` (numeric), `description` (text), `image` (text).
*   *Dica:* Insira alguns produtos iniciais via painel do Supabase para que a "Vitrine" não comece vazia.

### 3.2. Framework e Navegação
*   Utilize **Expo Router** ou **React Navigation**.
*   A lógica de segurança é *Front-end*: O app deve impedir a navegação para a tela de admin se a senha não for validada.

---

## 4. Roteiro de Desenvolvimento Sugerido

1.  **Configuração:** Inicie o projeto Expo e configure a conexão com Supabase (`lib/supabase.ts`).
2.  **Tela de Vitrine (Listagem):** Implemente o `select` para buscar dados e exibi-los em um `FlatList`. Foque na formatação (ex: `R$ 99,00`).
3.  **Tela de Gestão (Admin):** Reaproveite a lógica da aula para criar o formulário de cadastro e as funções de `insert`, `update` e `delete`.
4.  **Tela de Login (Lógica):**
    *   Crie um `TextInput` para senha e um `State` para armazená-la.
    *   Crie uma função `handleLogin()`:
        ```javascript
        const handleLogin = () => {
          if (password === '1234') {
            router.push('/admin'); // Ou nome da sua rota admin
          } else {
            Alert.alert("Acesso Negado", "Senha incorreta.");
          }
        }
        ```
5.  **Build:** Gere o executável para Android.

---

## 5. Instruções de Build e Entrega (Android)

Para validar a entrega profissional, você deve gerar o instalável `.apk` utilizando o **EAS (Expo Application Services)**.

### Passo 1: Instalação e Login
No terminal:
```bash
npm install -g eas-cli
eas login
```

### Passo 2: Configuração do Build
Configure o projeto:
```bash
eas build:configure
```
*(Selecione "Android").*

Edite o arquivo `eas.json` gerado na raiz. Garanta que o perfil `preview` gere um APK:
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

### Passo 3: Gerar Executável
Execute o comando e aguarde o link de download:
```bash
eas build -p android --profile preview
```
*Este processo pode levar cerca de 15 a 20 minutos.*

---

## 6. O que deve ser entregue

Envie um arquivo `.zip` ou link contendo:

1.  **Código Fonte:** Link do repositório (GitHub/GitLab).
2.  **O Executável:** Arquivo `.apk` gerado pelo EAS.
3.  **Vídeo ou Prints:**
    *   Print da **Tela de Login**.
    *   Print da **Vitrine** carregando dados do banco.
    *   Print da **Tela Admin** mostrando as opções de edição/exclusão.

## 7. Critérios de Avaliação

| Critério | Peso | Detalhes |
| :--- | :---: | :--- |
| **Segurança Básica** | 2.0 | O app impede acesso à área Admin sem a senha correta? O cliente consegue ver a vitrine sem senha? |
| **Integração Cloud** | 3.0 | A vitrine reflete os dados reais do Supabase? O Admin consegue alterar o banco? |
| **Usabilidade** | 2.0 | Navegação fluida entre Login -> Vitrine e Login -> Admin. Feedback visual de carregamento. |
| **Build Android** | 3.0 | Entrega do `.apk` funcional. |

**Desafio Extra (Opcional):** Adicione um campo "Quantidade em Estoque" no banco de dados. Na Vitrine, se a quantidade for 0, exiba "Indisponível" e impeça a visualização do detalhe.

senha:livia@12
url: https://apazvsehqccmoxrmilwp.supabase.co
chave anon(privada): sb_secret_i-7N1qma2Vc_2HPKsK0qOA_eIYSeNyh
chave pulblic(pulblica): sb_publishable_2ImNaFRg474daR2muyhEpw_W-c9LEgN

loguin usuario(comprar) ou administrativo(coloca e tirar produto) git e apk
quero tambem que deicheo bonito visualmente, a palheta ta em vermelho rosa pessego  creme- sofisticado e tecnologico