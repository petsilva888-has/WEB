# Tela de Login - São Paulo FC

Página de login responsiva com tema do São Paulo Futebol Clube: listras tricolores, escudo oficial e design moderno.

## Arquivos

- index.html — Estrutura HTML da página de login
- styles.css — Estilos com tema São Paulo FC
- script.js — Validação de formulário e toggle de senha
- assets/crest.svg — Escudo usado na página

## Características

- Fundo com faixas tricolores (preto, branco, vermelho)
- Logo do São Paulo em destaque
- Design responsivo (desktop, tablet, mobile)
- Validação básica de e-mail e senha
- Toggle para mostrar/ocultar senha

## Como usar

Abra `index.html` no navegador ou sirva a pasta com um servidor local.

## Personalização

- Substitua `assets/crest.svg` pelo escudo oficial se desejar alta fidelidade.
- Ajuste cores em `styles.css` para refinar o tema.

Desenvolvido com ❤️ para torcedores do Tricolor Paulista.
# Tela de Login - Seleção Brasileira

Uma página de login responsiva com design moderno, fundo em listras da seleção brasileira (verde, amarelo e azul) e logo da Seleção em destaque.

## 📋 Arquivos

- `index.html` — Estrutura HTML da página de login
- `styles.css` — Estilos com o tema da Seleção Brasileira e design responsivo
- `script.js` — Validação de formulário e toggle de senha
- `assets/logo.svg` — Logo da Seleção Brasileira
- `assets/crest.png` — Substitua este arquivo pelo logo oficial da Seleção Brasileira (PNG)

## 🎨 Características

- **Fundo da Seleção**: Listras verticais em verde, amarelo e azul
- **Logo Destacado**: Imagem do escudo da Seleção em destaque no topo
- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Validação de Formulário**: Valida e-mail e senha com mensagens de erro
- **Toggle de Senha**: Botão para mostrar/ocultar a senha
- **Efeitos Visuais**: Gradientes, sombras e transições suaves

## 🚀 Como Usar

### Opção 1: Abrir diretamente no navegador (Windows)

```powershell
start .\index.html
```

Ou clique duplo em `index.html`.

### Opção 2: Servir localmente (com Python)

```bash
python -m http.server 8000
```

Depois acesse: `http://localhost:8000`

### Opção 3: Servir localmente (com Node.js)

```bash
npx http-server
```

## 📝 Customizações

### Substituir o Logo
Coloque a imagem do escudo oficial em `assets/crest.png` (PNG) e o navegador usará automaticamente. Se não existir, o placeholder SVG será usado.

### Alterar Cores
Edite em `styles.css`:
- `#009c3b` — Verde da Seleção Brasileira
- `#ffdf00` — Amarelo da Seleção Brasileira
- `#002776` — Azul da Seleção Brasileira

### Integrar com Backend
No `script.js`, substitua o `alert()` na função de submit por uma chamada à sua API:

```javascript
// Exemplo com fetch
fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
})
.then(res => res.json())
.then(data => {
    if (data.success) {
        window.location.href = '/dashboard';
    }
});
```

## 📱 Responsividade

- **Desktop**: Layout completo com logo em destaque
- **Tablet**: Formulário centralizado
- **Mobile**: Otimizado para telas pequenas (480px+)

## ✅ Testes

Teste os campos de validação:
1. Deixar campos em branco e clicar em "Entrar"
2. Digitar um e-mail inválido
3. Digitar uma senha com menos de 6 caracteres
4. Clicar no ícone de olho para mostrar/ocultar senha

Desenvolvido com ❤️ para os torcedores da Seleção Brasileira!
