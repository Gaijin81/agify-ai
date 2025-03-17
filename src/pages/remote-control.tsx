import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { ControlAction } from '../lib/remote/remoteControlService';

export default function RemoteControlPage() {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [hasControlPermission, setHasControlPermission] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Fonction pour démarrer le partage d'écran
  const handleStartScreenShare = () => {
    // Dans une implémentation réelle, cela utiliserait remoteControlService.startScreenShareSession()
    setIsScreenSharing(true);
    addLog("Partage d'écran démarré");
    
    // Simuler une capture d'écran
    setScreenshot("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==");
  };
  
  // Fonction pour arrêter le partage d'écran
  const handleStopScreenShare = () => {
    // Dans une implémentation réelle, cela utiliserait remoteControlService.endScreenShareSession()
    setIsScreenSharing(false);
    setHasControlPermission(false);
    setScreenshot(null);
    addLog("Partage d'écran arrêté");
  };
  
  // Fonction pour demander la permission de contrôle
  const handleRequestControl = () => {
    // Dans une implémentation réelle, cela utiliserait remoteControlService.requestControlPermission()
    setHasControlPermission(true);
    addLog("Permission de contrôle accordée");
  };
  
  // Fonction pour révoquer la permission de contrôle
  const handleRevokeControl = () => {
    // Dans une implémentation réelle, cela utiliserait remoteControlService.revokeControlPermission()
    setHasControlPermission(false);
    addLog("Permission de contrôle révoquée");
  };
  
  // Fonction pour simuler une action de contrôle
  const simulateControlAction = (action: ControlAction, description: string) => {
    // Dans une implémentation réelle, cela utiliserait remoteControlService.sendControlAction()
    addLog(`Action de contrôle: ${action} - ${description}`);
  };
  
  // Fonction pour ajouter un log
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prevLogs => [`[${timestamp}] ${message}`, ...prevLogs]);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contrôle à Distance</h1>
          <p className="mt-2 text-gray-600">
            Partagez votre écran et permettez à l'IA de prendre le contrôle de votre PC pour exécuter des tâches automatiquement.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panneau de contrôle */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Panneau de contrôle</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Partage d'écran</h3>
                  {!isScreenSharing ? (
                    <Button 
                      variant="primary" 
                      onClick={handleStartScreenShare}
                      fullWidth
                    >
                      Démarrer le partage d'écran
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={handleStopScreenShare}
                      fullWidth
                    >
                      Arrêter le partage d'écran
                    </Button>
                  )}
                </div>
                
                {isScreenSharing && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Contrôle à distance</h3>
                    {!hasControlPermission ? (
                      <Button 
                        variant="primary" 
                        onClick={handleRequestControl}
                        fullWidth
                      >
                        Autoriser le contrôle à distance
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        onClick={handleRevokeControl}
                        fullWidth
                      >
                        Révoquer le contrôle à distance
                      </Button>
                    )}
                  </div>
                )}
                
                {isScreenSharing && hasControlPermission && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Actions de contrôle</h3>
                    <div className="space-y-2">
                      <Button 
                        variant="secondary" 
                        onClick={() => simulateControlAction(ControlAction.OPEN_APPLICATION, "Ouvrir VS Code")}
                        fullWidth
                      >
                        Ouvrir VS Code
                      </Button>
                      <Button 
                        variant="secondary" 
                        onClick={() => simulateControlAction(ControlAction.OPEN_APPLICATION, "Ouvrir le navigateur")}
                        fullWidth
                      >
                        Ouvrir le navigateur
                      </Button>
                      <Button 
                        variant="secondary" 
                        onClick={() => simulateControlAction(ControlAction.SCREENSHOT, "Prendre une capture d'écran")}
                        fullWidth
                      >
                        Prendre une capture d'écran
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Logs */}
            <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Journal d'activité</h2>
              </div>
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
                  {logs.length === 0 ? (
                    <p className="text-gray-500 text-center">Aucune activité pour le moment</p>
                  ) : (
                    <ul className="space-y-2">
                      {logs.map((log, index) => (
                        <li key={index} className="text-sm text-gray-700">{log}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Aperçu de l'écran */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Aperçu de l'écran</h2>
              </div>
              <div className="p-6">
                {isScreenSharing && screenshot ? (
                  <div>
                    <div className="bg-gray-800 rounded-lg overflow-hidden">
                      <img 
                        src={screenshot} 
                        alt="Capture d'écran" 
                        className="w-full h-auto"
                        style={{ minHeight: '400px' }}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500 text-center">
                      {hasControlPermission 
                        ? "L'IA peut voir votre écran et contrôler votre PC" 
                        : "L'IA peut voir votre écran mais ne peut pas le contrôler"}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center" style={{ minHeight: '400px' }}>
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-4 text-gray-500 text-center">
                      Démarrez le partage d'écran pour permettre à l'IA de voir votre écran
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Instructions de sécurité */}
            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Informations de sécurité
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Le partage d'écran et le contrôle à distance ne fonctionnent que pendant cette session</li>
                      <li>Vous pouvez révoquer l'accès à tout moment</li>
                      <li>Soyez prudent lorsque vous autorisez le contrôle à distance</li>
                      <li>Ne partagez jamais d'informations sensibles pendant une session de partage d'écran</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
