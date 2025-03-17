import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { AIModel, AIProvider as AIProviderEnum, Message } from '../lib/core/types';

export default function ConversationPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>(AIModel.OPENAI_GPT4);
  const [selectedProvider, setSelectedProvider] = useState<AIProviderEnum>(AIProviderEnum.OPENAI);

  // Fonction pour ajouter un message utilisateur
  const addUserMessage = (content: string) => {
    const userMessage: Message = {
      role: 'user',
      content
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
  };

  // Fonction pour simuler une réponse du système
  const simulateSystemResponse = async () => {
    setIsProcessing(true);
    
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const systemMessage: Message = {
      role: 'assistant',
      content: "J'ai bien reçu votre demande. Je vais l'analyser et la décomposer en tâches autonomes. Je vous notifierai une fois que tout sera terminé et testé."
    };
    
    setMessages(prevMessages => [...prevMessages, systemMessage]);
    setIsProcessing(false);
  };

  // Fonction pour gérer l'envoi du message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    addUserMessage(inputValue);
    setInputValue('');
    
    await simulateSystemResponse();
  };

  // Fonction pour gérer l'appui sur la touche Entrée
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Fonction pour obtenir la classe CSS en fonction du rôle du message
  const getMessageClass = (role: string) => {
    switch (role) {
      case 'user':
        return 'bg-blue-100 text-blue-900 ml-auto';
      case 'assistant':
        return 'bg-gray-100 text-gray-900 mr-auto';
      case 'system':
        return 'bg-yellow-100 text-yellow-900 mx-auto';
      default:
        return 'bg-gray-100 text-gray-900';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Conversation</h1>
          <div className="flex space-x-4">
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                Modèle
              </label>
              <select
                id="model"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as AIModel)}
              >
                <option value={AIModel.OPENAI_GPT4}>GPT-4</option>
                <option value={AIModel.OPENAI_GPT35_TURBO}>GPT-3.5 Turbo</option>
                <option value={AIModel.ANTHROPIC_CLAUDE_3_OPUS}>Claude 3 Opus</option>
                <option value={AIModel.ANTHROPIC_CLAUDE_3_SONNET}>Claude 3 Sonnet</option>
                <option value={AIModel.ANTHROPIC_CLAUDE_3_HAIKU}>Claude 3 Haiku</option>
              </select>
            </div>
            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
                Fournisseur
              </label>
              <select
                id="provider"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value as AIProviderEnum)}
              >
                <option value={AIProviderEnum.OPENAI}>OpenAI</option>
                <option value={AIProviderEnum.ANTHROPIC}>Anthropic</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white shadow rounded-lg overflow-hidden flex flex-col">
          {/* Zone de messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="text-4xl mb-4">👋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bienvenue dans AGI Wrapper</h3>
                <p className="text-gray-500 max-w-md">
                  Décrivez ce que vous souhaitez accomplir, peu importe la complexité. 
                  Notre système décomposera automatiquement votre demande en tâches exécutables 
                  et les réalisera de manière autonome.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`max-w-3/4 rounded-lg px-4 py-2 ${getMessageClass(message.role)}`}
                  >
                    {message.content}
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <div className="animate-bounce">●</div>
                    <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</div>
                    <div className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Zone de saisie */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-3">
              <div className="flex-1">
                <textarea
                  rows={3}
                  className="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Décrivez ce que vous souhaitez accomplir..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isProcessing}
                ></textarea>
              </div>
              <div className="flex-shrink-0">
                <Button
                  variant="primary"
                  onClick={handleSendMessage}
                  disabled={isProcessing || !inputValue.trim()}
                >
                  Envoyer
                </Button>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Appuyez sur Entrée pour envoyer. Utilisez Maj+Entrée pour un saut de ligne.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
