import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { CollectiveExperienceNetwork } from '../lib/collective/collectiveExperienceNetwork';

export default function CollectiveNetworkPage() {
  const [networkStats, setNetworkStats] = useState<{
    nodeCount: number;
    userCount: number;
    topNodes: Array<{
      id: string;
      effectiveness: number;
      tags: string[];
      connectionCount: number;
    }>;
    topTags: Array<{
      tag: string;
      count: number;
    }>;
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [suggestedPrompts, setSuggestedPrompts] = useState<Array<{
    prompt: string;
    confidence: number;
    description: string;
  }>>([]);
  
  // Simuler l'initialisation du réseau
  const initializeNetwork = () => {
    setIsLoading(true);
    
    // Simuler un délai de chargement
    setTimeout(() => {
      // Créer une instance du réseau
      const network = new CollectiveExperienceNetwork();
      
      // Générer un rapport sur l'état du réseau
      const report = network.generateNetworkReport();
      setNetworkStats(report);
      
      // Simuler des suggestions de prompts
      setSuggestedPrompts([
        {
          prompt: "Analyse cette base de données et identifie les tendances principales",
          confidence: 0.85,
          description: "Basé sur votre intérêt pour l'analyse de données"
        },
        {
          prompt: "Optimise ce code JavaScript pour améliorer les performances",
          confidence: 0.78,
          description: "Basé sur votre intérêt pour le développement web"
        },
        {
          prompt: "Crée un plan de test complet pour cette application",
          confidence: 0.72,
          description: "Basé sur votre intérêt pour l'assurance qualité"
        }
      ]);
      
      setIsLoading(false);
    }, 1500);
  };
  
  // Améliorer un prompt
  const handleEnhancePrompt = () => {
    if (!userPrompt) return;
    
    setIsLoading(true);
    
    // Simuler un délai de traitement
    setTimeout(() => {
      // Créer une instance du réseau
      const network = new CollectiveExperienceNetwork();
      
      // Améliorer le prompt
      const enhanced = network.enhancePrompt(userPrompt, 'user-123');
      setEnhancedPrompt(enhanced);
      
      setIsLoading(false);
    }, 800);
  };
  
  // Utiliser un prompt suggéré
  const handleUseSuggestedPrompt = (prompt: string) => {
    setUserPrompt(prompt);
    
    // Simuler l'amélioration automatique
    setTimeout(() => {
      // Créer une instance du réseau
      const network = new CollectiveExperienceNetwork();
      
      // Améliorer le prompt
      const enhanced = network.enhancePrompt(prompt, 'user-123');
      setEnhancedPrompt(enhanced);
    }, 300);
  };
  
  // Initialiser le réseau au chargement de la page
  React.useEffect(() => {
    initializeNetwork();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Réseau Neuronal d'Expérience Collective</h1>
          <p className="mt-2 text-gray-600">
            Ce système révolutionnaire permet à l'application d'apprendre collectivement des interactions de tous les utilisateurs,
            d'adapter dynamiquement les prompts et d'anticiper vos besoins.
          </p>
        </div>
        
        {/* Statistiques du réseau */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">État du Réseau Neuronal</h2>
          </div>
          <div className="p-6">
            {isLoading && !networkStats ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
              </div>
            ) : networkStats ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-indigo-600">{networkStats.nodeCount}</div>
                    <div className="text-sm text-gray-500">Nœuds d'expérience</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-600">{networkStats.userCount}</div>
                    <div className="text-sm text-gray-500">Utilisateurs actifs</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-purple-600">{networkStats.topNodes.length}</div>
                    <div className="text-sm text-gray-500">Nœuds hautement efficaces</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-2">Tags les plus populaires</h3>
                    <div className="flex flex-wrap gap-2">
                      {networkStats.topTags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {tag.tag} ({tag.count})
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-2">Nœuds les plus efficaces</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {networkStats.topNodes.slice(0, 3).map((node, index) => (
                        <li key={index}>
                          <div className="flex items-center">
                            <div className="w-8 text-right mr-2 text-gray-500">{node.effectiveness}%</div>
                            <div className="flex-1">
                              <div className="h-2 bg-gray-200 rounded-full">
                                <div 
                                  className="h-2 bg-indigo-500 rounded-full" 
                                  style={{ width: `${node.effectiveness}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-10 mt-1">
                            {node.tags.map((tag, tagIndex) => (
                              <span key={tagIndex} className="inline-flex items-center mr-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Impossible de charger les statistiques du réseau
              </div>
            )}
          </div>
        </div>
        
        {/* Amélioration de prompts */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Amélioration de Prompts</h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <label htmlFor="user-prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Votre prompt
              </label>
              <textarea
                id="user-prompt"
                rows={3}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Entrez votre prompt ici..."
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
              ></textarea>
              <div className="mt-2 flex justify-end">
                <Button
                  variant="primary"
                  onClick={handleEnhancePrompt}
                  disabled={isLoading || !userPrompt}
                >
                  {isLoading ? 'Amélioration en cours...' : 'Améliorer avec le RNEC'}
                </Button>
              </div>
            </div>
            
            {enhancedPrompt && (
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 mb-2">Prompt amélioré</h3>
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">{enhancedPrompt}</pre>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Ce prompt a été amélioré en utilisant l'expérience collective du réseau neuronal.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Prompts suggérés */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Prompts Suggérés</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              Basés sur votre profil et vos interactions précédentes, voici des prompts qui pourraient vous intéresser:
            </p>
            
            {suggestedPrompts.length > 0 ? (
              <div className="space-y-4">
                {suggestedPrompts.map((suggestion, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{suggestion.prompt}</p>
                        <p className="text-xs text-gray-500 mt-1">{suggestion.description}</p>
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {Math.round(suggestion.confidence * 100)}% pertinent
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button
                        variant="secondary"
                        onClick={() => handleUseSuggestedPrompt(suggestion.prompt)}
                        size="sm"
                      >
                        Utiliser ce prompt
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucun prompt suggéré pour le moment. Continuez à utiliser l'application pour recevoir des suggestions personnalisées.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
