import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { AIModel, AIProvider as AIProviderEnum } from '../lib/core/types';

export default function SettingsPage() {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [anthropicApiKey, setAnthropicApiKey] = useState('');
  const [defaultProvider, setDefaultProvider] = useState<AIProviderEnum>(AIProviderEnum.OPENAI);
  const [defaultModel, setDefaultModel] = useState<AIModel>(AIModel.OPENAI_GPT4);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simuler un délai de sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simuler une sauvegarde réussie
    setSaveSuccess(true);
    setIsSaving(false);
    
    // Réinitialiser le message de succès après 3 secondes
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Fonction pour obtenir les modèles disponibles en fonction du fournisseur sélectionné
  const getAvailableModels = (provider: AIProviderEnum) => {
    switch (provider) {
      case AIProviderEnum.OPENAI:
        return [
          { value: AIModel.OPENAI_GPT4, label: 'GPT-4' },
          { value: AIModel.OPENAI_GPT35_TURBO, label: 'GPT-3.5 Turbo' }
        ];
      case AIProviderEnum.ANTHROPIC:
        return [
          { value: AIModel.ANTHROPIC_CLAUDE_3_OPUS, label: 'Claude 3 Opus' },
          { value: AIModel.ANTHROPIC_CLAUDE_3_SONNET, label: 'Claude 3 Sonnet' },
          { value: AIModel.ANTHROPIC_CLAUDE_3_HAIKU, label: 'Claude 3 Haiku' }
        ];
      default:
        return [];
    }
  };

  // Mettre à jour le modèle par défaut lorsque le fournisseur change
  const handleProviderChange = (provider: AIProviderEnum) => {
    setDefaultProvider(provider);
    
    // Sélectionner automatiquement le premier modèle disponible pour ce fournisseur
    const availableModels = getAvailableModels(provider);
    if (availableModels.length > 0) {
      setDefaultModel(availableModels[0].value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="mt-2 text-gray-600">
            Configurez vos clés API et préférences pour l'application AGI Wrapper.
          </p>
        </div>

        {saveSuccess && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Vos paramètres ont été enregistrés avec succès.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Clés API</h2>
              <p className="mt-1 text-sm text-gray-500">
                Entrez vos clés API pour accéder aux services d'IA. Ces clés sont stockées de manière sécurisée.
              </p>
              
              <div className="mt-6 space-y-6">
                <div>
                  <label htmlFor="openai-api-key" className="block text-sm font-medium text-gray-700">
                    Clé API OpenAI
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      id="openai-api-key"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="sk-..."
                      value={openaiApiKey}
                      onChange={(e) => setOpenaiApiKey(e.target.value)}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Nécessaire pour utiliser les modèles GPT-4 et GPT-3.5 Turbo.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="anthropic-api-key" className="block text-sm font-medium text-gray-700">
                    Clé API Anthropic
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      id="anthropic-api-key"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="sk_ant-..."
                      value={anthropicApiKey}
                      onChange={(e) => setAnthropicApiKey(e.target.value)}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Nécessaire pour utiliser les modèles Claude 3 (Opus, Sonnet, Haiku).
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Préférences</h2>
              <p className="mt-1 text-sm text-gray-500">
                Personnalisez le comportement de l'application selon vos besoins.
              </p>
              
              <div className="mt-6 space-y-6">
                <div>
                  <label htmlFor="default-provider" className="block text-sm font-medium text-gray-700">
                    Fournisseur d'IA par défaut
                  </label>
                  <select
                    id="default-provider"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={defaultProvider}
                    onChange={(e) => handleProviderChange(e.target.value as AIProviderEnum)}
                  >
                    <option value={AIProviderEnum.OPENAI}>OpenAI</option>
                    <option value={AIProviderEnum.ANTHROPIC}>Anthropic</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="default-model" className="block text-sm font-medium text-gray-700">
                    Modèle d'IA par défaut
                  </label>
                  <select
                    id="default-model"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={defaultModel}
                    onChange={(e) => setDefaultModel(e.target.value as AIModel)}
                  >
                    {getAvailableModels(defaultProvider).map((model) => (
                      <option key={model.value} value={model.value}>
                        {model.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="notifications"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={notificationsEnabled}
                      onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="notifications" className="font-medium text-gray-700">
                      Activer les notifications
                    </label>
                    <p className="text-gray-500">
                      Recevez des notifications lorsque vos tâches sont terminées.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
              >
                {isSaving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
