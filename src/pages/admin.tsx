import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { Button } from '../components/ui/Button';

export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminSessionId, setAdminSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [adminFeatures, setAdminFeatures] = useState<string[]>([]);
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [advancedPrompt, setAdvancedPrompt] = useState('');
  const [restrictionsDisabled, setRestrictionsDisabled] = useState(false);

  // Fonction pour gérer la connexion
  const handleLogin = () => {
    // Dans une implémentation réelle, cela utiliserait adminModeService.verifyCredentials()
    if (username === 'admin' && password === 'admin123') {
      // Simuler la création d'une session admin
      const sessionId = 'admin-session-' + Math.random().toString(36).substring(2, 15);
      setAdminSessionId(sessionId);
      setIsLoggedIn(true);
      setError(null);
      setSuccess('Connexion réussie en mode administrateur');
      
      // Simuler la récupération des fonctionnalités admin
      setAdminFeatures([
        "Désactivation des filtres de sécurité sur les requêtes",
        "Accès aux applications normalement restreintes",
        "Exécution de commandes avancées via le contrôle à distance",
        "Support pour les requêtes liées au pentest et à la sécurité",
        "Accès à des modèles d'IA plus avancés",
        "Personnalisation avancée des prompts système",
        "Journalisation détaillée des actions"
      ]);
    } else {
      setError('Identifiants incorrects');
      setSuccess(null);
    }
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    // Dans une implémentation réelle, cela utiliserait adminModeService.endAdminSession()
    setIsLoggedIn(false);
    setAdminSessionId(null);
    setUsername('');
    setPassword('');
    setError(null);
    setSuccess('Déconnexion réussie');
    setRestrictionsDisabled(false);
  };

  // Fonction pour ajouter un nouvel administrateur
  const handleAddAdmin = () => {
    if (!newAdminUsername || !newAdminPassword) {
      setError('Veuillez remplir tous les champs');
      setSuccess(null);
      return;
    }
    
    // Dans une implémentation réelle, cela utiliserait adminModeService.addAdmin()
    setSuccess(`Nouvel administrateur "${newAdminUsername}" ajouté avec succès`);
    setError(null);
    setNewAdminUsername('');
    setNewAdminPassword('');
  };

  // Fonction pour désactiver les restrictions
  const handleToggleRestrictions = () => {
    setRestrictionsDisabled(!restrictionsDisabled);
    setSuccess(restrictionsDisabled 
      ? 'Restrictions réactivées' 
      : 'Restrictions désactivées - Mode administrateur complet activé');
    setError(null);
  };

  // Fonction pour envoyer un prompt avancé
  const handleSendAdvancedPrompt = () => {
    if (!advancedPrompt) {
      setError('Veuillez entrer un prompt');
      setSuccess(null);
      return;
    }
    
    // Dans une implémentation réelle, cela enverrait le prompt à l'IA
    setSuccess('Prompt avancé envoyé avec succès');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mode Administrateur</h1>
          <p className="mt-2 text-gray-600">
            Accédez aux fonctionnalités avancées et désactivez les restrictions de sécurité.
          </p>
        </div>

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!isLoggedIn ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Connexion Administrateur</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Nom d'utilisateur
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="username"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      id="password"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Button
                    variant="primary"
                    onClick={handleLogin}
                  >
                    Se connecter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Panneau de contrôle admin */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Panneau de contrôle administrateur</h2>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                >
                  Déconnexion
                </Button>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Statut</h3>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Connecté en tant qu'administrateur
                    </span>
                    {restrictionsDisabled && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Restrictions désactivées
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Fonctionnalités administrateur</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    {adminFeatures.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <Button
                    variant={restrictionsDisabled ? "outline" : "primary"}
                    onClick={handleToggleRestrictions}
                    className={restrictionsDisabled ? "bg-red-50 text-red-700 border-red-300 hover:bg-red-100" : ""}
                  >
                    {restrictionsDisabled ? "Réactiver les restrictions" : "Désactiver les restrictions"}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Gestion des administrateurs */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Gestion des administrateurs</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-2">Ajouter un nouvel administrateur</h3>
                  </div>
                  
                  <div>
                    <label htmlFor="new-username" className="block text-sm font-medium text-gray-700">
                      Nom d'utilisateur
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="new-username"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={newAdminUsername}
                        onChange={(e) => setNewAdminUsername(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                      Mot de passe
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        id="new-password"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Button
                      variant="secondary"
                      onClick={handleAddAdmin}
                    >
                      Ajouter l'administrateur
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Prompt avancé */}
            {restrictionsDisabled && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h2 className="text-lg font-medium text-gray-900">Prompt avancé (sans restrictions)</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="advanced-prompt" className="block text-sm font-medium text-gray-700">
                        Entrez votre prompt avancé
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="advanced-prompt"
                          rows={5}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Entrez votre prompt sans restrictions ici (pentest, sécurité, etc.)"
                          value={advancedPrompt}
                          onChange={(e) => setAdvancedPrompt(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                    
                    <div>
                      <Button
                        variant="primary"
                        onClick={handleSendAdvancedPrompt}
                      >
                        Envoyer le prompt avancé
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Avertissement de sécurité */}
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Attention : Mode administrateur
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      Le mode administrateur désactive les restrictions de sécurité et permet d'accéder à des fonctionnalités avancées. Utilisez-le avec précaution et uniquement pour des fins légitimes. Vous êtes responsable de toutes les actions effectuées en mode administrateur.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
