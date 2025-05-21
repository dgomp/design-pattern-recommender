# Design Pattern Recommender

Sistema inteligente para recomendar Design Patterns baseado em casos de uso, utilizando IA generativa (Google Gemini API) e uma interface futurista inspirada em Matrix.

## Estrutura do Projeto

```
design-pattern/
├── app.py                  # Servidor Flask e lógica do backend
├── pattern_recommender.py  # Lógica de recomendação usando Gemini API
├── requirements.txt        # Dependências Python
├── frontend/               # Código fonte do frontend React
│   ├── src/                # Código fonte React
│   ├── public/             # Arquivos estáticos
│   ├── package.json        # Dependências npm
│   └── ...
├── static/                 # Frontend compilado (gerado automaticamente)
└── README.md               # Documentação do projeto
```

## Requisitos

- Python 3.8 ou superior
- Node.js 16.0 ou superior
- npm 7.0 ou superior
- Conta Google com acesso à Gemini API (obtenha sua chave em https://makersuite.google.com/app/apikey)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/dgomp/design-pattern-recommender.git
cd design-pattern
```

2. Crie um arquivo `.env` na raiz do projeto com sua chave Gemini:
```
GOOGLE_API_KEY=sua_chave_aqui
```

3. Instale as dependências Python:
```bash
pip install -r requirements.txt
```

4. Instale as dependências do frontend:
```bash
cd frontend
npm install
cd ..
```

## Executando o Sistema

1. Execute o servidor:
```bash
python app.py
```

O sistema estará disponível em `http://localhost:5000` ou `http://127.0.0.1:5000`

Na primeira execução, o script irá:
- Compilar o frontend React
- Iniciar o servidor Flask

## Funcionalidades

- Interface futurista inspirada em Matrix (animação, glassmorphism, neon, som de digitação)
- Análise de casos de uso usando IA generativa (Google Gemini)
- Recomendação dos 3 Design Patterns mais apropriados
- Porcentagem de confiança para cada recomendação
- Explicação detalhada e implementação separadas para cada padrão
- Sugestão de implementação formatada como lista numerada
- Totalmente gratuito (mas requer conexão com a internet e chave Gemini)

## Tecnologias Utilizadas

### Backend
- Flask (servidor web)
- requests (requisições HTTP)
- python-dotenv (variáveis de ambiente)
- flask-cors (CORS)
- Google Gemini API (IA generativa)

### Frontend
- React (biblioteca UI)
- TypeScript (tipagem estática)
- Tailwind CSS (estilização)
- Framer Motion (animações)
- Heroicons (ícones)

## API

### POST /recommend
Recebe um caso de uso e retorna recomendações de Design Patterns.

**Request Body:**
```json
{
    "useCase": "Descrição do caso de uso"
}
```

**Response:**
```json
{
    "patterns": [
        {
            "name": "Nome do Padrão",
            "confidence": 0.85,
            "explanation": "Explicação detalhada",
            "implementation": "Sugestão de implementação"
        },
        // ... até 3 padrões
    ]
}
```

## Desenvolvimento

### Backend
- `app.py`: Servidor Flask que gerencia as requisições e serve o frontend
- `pattern_recommender.py`: Implementa a lógica de recomendação usando Gemini API

### Frontend
- Projeto React separado, compilado e servido pelo Flask
- Desenvolvimento: `cd frontend && npm start`
- Compilação: `cd frontend && npm run build`

## Dicas
- Sempre rode `npm run build` após alterações no frontend para ver as mudanças na versão de produção.
- O backend depende de conexão com a internet para acessar a Gemini API.
- O frontend aceita tanto `localhost` quanto `127.0.0.1`.

## Contribuindo
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request 