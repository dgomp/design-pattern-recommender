import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Adiciona a fonte Orbitron no topo do arquivo (será usada inline no título)

interface Pattern {
  name: string;
  confidence: number;
  explanation: string;
  implementation: string;
}

interface Recommendation {
  patterns: Pattern[];
}

// Função utilitária para formatar a implementação como lista numerada e destacar código
function formatImplementation(impl: string) {
  // Divide em itens numerados (1. ... 2. ...)
  const items = impl.split(/\n?\s*\d+\.\s+/).filter(Boolean);
  if (items.length > 1) {
    return (
      <ol className="list-decimal ml-6 space-y-2 text-base md:text-lg">
        {items.map((item, idx) => (
          <li key={idx} className="text-green-200 text-justify" style={{ textShadow: '0 0 2px #39ff14', fontFamily: 'monospace' }}>
            {/* Destaca trechos entre crases como código */}
            {item.split(/(`[^`]+`)/g).map((part, i) =>
              part.startsWith('`') && part.endsWith('`') ? (
                <code key={i} className="bg-gray-800 text-green-300 px-1 py-0.5 rounded text-base md:text-lg mx-1">
                  {part.slice(1, -1)}
                </code>
              ) : (
                part
              )
            )}
          </li>
        ))}
      </ol>
    );
  }
  // Se não for lista, apenas destaca código
  return <span className="text-base md:text-lg">{
    impl.split(/(`[^`]+`)/g).map((part, i) =>
      part.startsWith('`') && part.endsWith('`') ? (
        <code key={i} className="bg-gray-800 text-green-300 px-1 py-0.5 rounded text-base md:text-lg mx-1">
          {part.slice(1, -1)}
        </code>
      ) : (
        part
      )
    )
  }</span>;
}

// Função utilitária para separar explicação e implementação se vierem juntas
function splitExplanationAndImplementation(explanation: string, implementation: string) {
  if (implementation && implementation.trim().length > 10) {
    return { exp: explanation, impl: implementation };
  }
  // Tenta separar por palavras-chave
  const match = explanation.match(/([\s\S]*?)(?:\n+)?(?:Implementa[cç][aã]o:|Passos:|Exemplo:|\d+\.\s)/i);
  if (match) {
    const idx = match[1].length;
    return {
      exp: explanation.slice(0, idx).trim(),
      impl: explanation.slice(idx).trim() + (implementation ? ('\n' + implementation) : '')
    };
  }
  return { exp: explanation, impl: implementation };
}

function App() {
  const [useCase, setUseCase] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUseCase(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!useCase.trim()) {
      setError('Por favor, descreva o caso de uso.');
      return;
    }
    if (useCase.length < 10) {
      setError('Por favor, forneça uma descrição mais detalhada do caso de uso.');
      return;
    }
    if (useCase.length > 5000) {
      setError('A descrição do caso de uso é muito longa. Por favor, seja mais concisa.');
      return;
    }
    setLoading(true);
    setError('');
    setRecommendation(null);

    try {
      const response = await fetch(`http://${window.location.hostname}:5000/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block'
        },
        body: JSON.stringify({ useCase: useCase.trim() })
      });

      if (!response.ok) {
        throw new Error('Erro ao processar sua solicitação');
      }

      const data = await response.json();
      setRecommendation(data);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'Failed to fetch') {
          setError('Não foi possível conectar ao servidor. Por favor, verifique se o servidor está rodando (python app.py) e tente novamente.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fonte Orbitron para o título */}
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap" rel="stylesheet" />
      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Orbitron, sans-serif', color: '#39ff14', textShadow: '0 0 8px #39ff14, 0 0 16px #39ff14' }}>
            <span className="inline-block animate-pulse">&#x2728;</span> Design Pattern Recommender
          </h1>
          <p className="text-gray-200 text-lg" style={{ textShadow: '0 0 8px #39ff14' }}>
            Descreva seu caso de uso e receba recomendações de padrões de design
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl w-full mx-auto bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-white/20"
          style={{ boxShadow: '0 8px 32px 0 rgba(57,255,20,0.25)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="useCase" className="block text-sm font-medium text-green-200 mb-2" style={{ textShadow: '0 0 4px #39ff14' }}>
                Caso de Uso
              </label>
              <textarea
                id="useCase"
                value={useCase}
                onChange={handleTextChange}
                className="w-full px-4 py-2 border border-green-400 bg-black/60 text-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 placeholder-green-400 placeholder-opacity-60"
                rows={6}
                placeholder="Descreva seu caso de uso aqui..."
                style={{ fontFamily: 'monospace', fontSize: '1.1rem', boxShadow: '0 0 8px #39ff14' }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 16px #39ff14, 0 0 32px #39ff14' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-bold tracking-widest transition-all duration-200 bg-gradient-to-r from-green-400 via-green-600 to-green-400 shadow-lg border-2 border-green-400 ${
                loading 
                  ? 'opacity-60 cursor-not-allowed' 
                  : 'hover:from-green-300 hover:to-green-500 hover:shadow-green-400/50'
              }`}
              style={{ textShadow: '0 0 8px #39ff14' }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analisando...
                </div>
              ) : (
                'Recomendar Padrões'
              )}
            </motion.button>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-red-900/80 border border-red-400 rounded-lg shadow-lg"
            >
              <p className="text-red-200" style={{ textShadow: '0 0 4px #ff1744' }}>{error}</p>
            </motion.div>
          )}

          {recommendation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 space-y-6"
            >
              <div className="bg-black/70 rounded-2xl p-8 border border-green-400 shadow-xl" style={{ boxShadow: '0 0 32px #39ff14' }}>
                <h2 className="text-xl font-semibold text-green-400 mb-4" style={{ textShadow: '0 0 8px #39ff14' }}>Recomendação</h2>
                <div className="space-y-8">
                  {recommendation.patterns.map((pattern, idx) => {
                    const { exp, impl } = splitExplanationAndImplementation(pattern.explanation, pattern.implementation);
                    return (
                      <div key={idx} className="p-4 rounded-xl bg-black/60 border border-green-700 shadow-lg">
                        <h3 className="text-lg font-bold text-green-300 mb-2 flex items-center gap-4" style={{ textShadow: '0 0 4px #39ff14' }}>
                          {idx + 1}. <span>{pattern.name}</span>
                          <span className="ml-2 text-green-400 font-normal text-base bg-gray-900/60 px-2 py-1 rounded">
                            {Number.isInteger(pattern.confidence * 100)
                              ? `${pattern.confidence * 100}%`
                              : `${(pattern.confidence * 100).toFixed(1)}%`}
                          </span>
                        </h3>
                        <div>
                          <span className="block text-green-200 text-justify mb-2" style={{ textShadow: '0 0 2px #39ff14' }}>
                            {exp}
                          </span>
                          <span className="block text-green-200 text-justify whitespace-pre-line mt-2" style={{ textShadow: '0 0 2px #39ff14', fontFamily: 'monospace' }}>
                            {formatImplementation(impl)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default App; 