import React, { useState, useEffect } from 'react';

// Моковые данные для демонстрации
const mockUsers = [
  {
    id: 1,
    name: "Анна",
    age: 25,
    bio: "Люблю путешествия и фотографию 📸",
    photos: ["assets/anna1.jpeg?prompt=Beautiful%20young%20woman%20smiling%2C%20portrait%20photo"],
    distance: "2 км"
  },
  {
    id: 2,
    name: "Мария",
    age: 23,
    bio: "Художница и любительница кофе ☕",
    photos: ["assets/maria1.jpeg?prompt=Artistic%20young%20woman%20with%20creative%20style%2C%20portrait"],
    distance: "5 км"
  },
  {
    id: 3,
    name: "Елена",
    age: 27,
    bio: "Йога, здоровый образ жизни 🧘‍♀️",
    photos: ["assets/elena1.jpeg?prompt=Sporty%20young%20woman%20practicing%20yoga%2C%20healthy%20lifestyle"],
    distance: "1 км"
  }
];

const DatingApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [debugInfo, setDebugInfo] = useState([]);
  const [showDebug, setShowDebug] = useState(false);

  // Функция для добавления отладочной информации
  const addDebugInfo = (message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    const debugEntry = {
      time: timestamp,
      message,
      data: data ? JSON.stringify(data, null, 2) : null
    };
    setDebugInfo(prev => [...prev, debugEntry]);
    console.log(`[${timestamp}] ${message}`, data);
  };

  // Инициализация Telegram WebApp
  useEffect(() => {
    const initTelegram = async () => {
      addDebugInfo('=== TELEGRAM DEBUG START ===');
      addDebugInfo('window.Telegram exists', !!window.Telegram);
      addDebugInfo('User Agent', navigator.userAgent);
      addDebugInfo('Location', window.location.href);
      addDebugInfo('Document ready state', document.readyState);
      
      // Добавляем задержку для загрузки Telegram скрипта
      const waitForTelegram = (maxAttempts = 50) => {
        return new Promise((resolve, reject) => {
          let attempts = 0;
          const checkTelegram = () => {
            attempts++;
            addDebugInfo(`Попытка ${attempts}/${maxAttempts} найти Telegram WebApp`);
            
            if (window.Telegram && window.Telegram.WebApp) {
              addDebugInfo('✅ Telegram WebApp найден!');
              resolve(window.Telegram.WebApp);
            } else if (attempts >= maxAttempts) {
              addDebugInfo('❌ Telegram WebApp не найден после максимального количества попыток');
              reject(new Error('Telegram WebApp не найден'));
            } else {
              setTimeout(checkTelegram, 200);
            }
          };
          checkTelegram();
        });
      };

      try {
        addDebugInfo('Инициализация Telegram WebApp...');
        
        // Ждем загрузки Telegram скрипта
        const tg = await waitForTelegram();
        addDebugInfo('Telegram WebApp объект получен', typeof tg);
        
        // Настройка WebApp
        tg.ready();
        addDebugInfo('WebApp ready() вызван');
        
        tg.expand();
        addDebugInfo('WebApp expand() вызван');
        
        // Логируем все доступные данные
        addDebugInfo('=== TELEGRAM DATA ===');
        addDebugInfo('initData (raw)', tg.initData);
        addDebugInfo('initData length', tg.initData?.length);
        addDebugInfo('initDataUnsafe', tg.initDataUnsafe);
        addDebugInfo('user', tg.initDataUnsafe?.user);
        addDebugInfo('platform', tg.platform);
        addDebugInfo('version', tg.version);
        addDebugInfo('colorScheme', tg.colorScheme);
        addDebugInfo('themeParams', tg.themeParams);
        addDebugInfo('isExpanded', tg.isExpanded);
        addDebugInfo('viewportHeight', tg.viewportHeight);
        addDebugInfo('viewportStableHeight', tg.viewportStableHeight);
        
        // Получаем данные пользователя
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
          const user = tg.initDataUnsafe.user;
          addDebugInfo('✅ Пользователь найден в initDataUnsafe', user);
          
          setCurrentUser({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            photoUrl: user.photo_url
          });
        } else if (tg.initData && tg.initData.length > 0) {
          // Попробуем парсить initData вручную
          addDebugInfo('⚠️ Попытка парсинга initData вручную...');
          addDebugInfo('Raw initData', tg.initData);
          
          try {
            const urlParams = new URLSearchParams(tg.initData);
            const parsedParams = Object.fromEntries(urlParams);
            addDebugInfo('Parsed URL params', parsedParams);
            
            const userStr = urlParams.get('user');
            addDebugInfo('User string from params', userStr);
            
            if (userStr) {
              const user = JSON.parse(decodeURIComponent(userStr));
              addDebugInfo('✅ Пользователь из initData', user);
              
              setCurrentUser({
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                username: user.username,
                photoUrl: user.photo_url
              });
            } else {
              throw new Error('Нет параметра user в initData');
            }
          } catch (parseError) {
            addDebugInfo('❌ Ошибка парсинга initData', parseError.message);
            throw parseError;
          }
        } else {
          addDebugInfo('⚠️ Нет данных пользователя в Telegram WebApp');
          addDebugInfo('initDataUnsafe существует', !!tg.initDataUnsafe);
          addDebugInfo('initData существует', !!tg.initData);
          addDebugInfo('initData не пустая', tg.initData && tg.initData.length > 0);
          throw new Error('Нет данных пользователя');
        }
        
        // Настройка кнопки назад
        if (tg.BackButton) {
          tg.BackButton.onClick(() => {
            addDebugInfo('Back button clicked');
            if (currentScreen === 'matches' || currentScreen === 'profile') {
              setCurrentScreen('swipe');
            }
          });
          addDebugInfo('✅ Back button настроена');
        }
        
        addDebugInfo('✅ Telegram WebApp успешно инициализирован');
        
      } catch (error) {
        addDebugInfo('❌ Ошибка инициализации Telegram WebApp', error.message);
        addDebugInfo('Переключение на тестовый режим');
        
        // Показываем детальную информацию об ошибке
        setCurrentUser({
          id: 12345,
          firstName: "🔧 DEBUG MODE",
          lastName: `Error: ${error.message}`,
          username: "debug_user"
        });
        
        // Автоматически показываем отладку при ошибке
        setTimeout(() => {
          setShowDebug(true);
        }, 1000);
      }
      
      addDebugInfo('=== TELEGRAM DEBUG END ===');
      setCurrentScreen('swipe');
      setIsInitialized(true);
    };

    // Небольшая задержка для полной загрузки DOM
    const delayedInit = () => {
      setTimeout(() => {
        addDebugInfo('Запуск инициализации с задержкой...');
        initTelegram();
      }, 500);
    };

    // Проверяем готовность документа
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', delayedInit);
    } else {
      delayedInit();
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', delayedInit);
    };
  }, []);

  // Обновление кнопки назад при смене экрана
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      if (currentScreen === 'matches' || currentScreen === 'profile') {
        tg.BackButton.show();
      } else {
        tg.BackButton.hide();
      }
    }
  }, [currentScreen]);

  // Обработка свайпов
  const handleSwipe = (direction) => {
    // Вибрация (если доступна)
    try {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }
    } catch (e) {
      console.log('Haptic feedback not available');
    }
    
    if (direction === 'right') {
      // Симуляция матча
      if (Math.random() > 0.5) {
        setMatches(prev => [...prev, mockUsers[currentCardIndex]]);
        try {
          if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
          }
        } catch (e) {
          console.log('Haptic feedback not available');
        }
      }
    }
    
    if (currentCardIndex < mockUsers.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentScreen('matches');
    }
  };

  // Компонент отладки
  const DebugPanel = () => {
    if (!showDebug) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-hidden flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-bold">🔧 Отладочная информация</h3>
            <button 
              onClick={() => setShowDebug(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-2 text-xs font-mono">
              {debugInfo.map((entry, index) => (
                <div key={index} className="border-b pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-blue-600 font-semibold">{entry.time}</span>
                    <span className="text-green-600">{entry.message}</span>
                  </div>
                  {entry.data && (
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                      {entry.data}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t flex space-x-2">
            <button 
              onClick={() => {
                setDebugInfo([]);
              }}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              Очистить
            </button>
            <button 
              onClick={() => {
                const debugText = debugInfo.map(entry => 
                  `[${entry.time}] ${entry.message}${entry.data ? '\n' + entry.data : ''}`
                ).join('\n\n');
                navigator.clipboard?.writeText(debugText);
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Копировать
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (currentScreen === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-pink-400 to-purple-600 relative">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl">Загружаем приложение...</p>
        </div>
        
        {/* Debug button */}
        <button 
          onClick={() => setShowDebug(true)}
          className="absolute top-4 right-4 w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
          title="Отладка"
        >
          🔧
        </button>
        
        <DebugPanel />
      </div>
    );
  }

  if (currentScreen === 'swipe') {
    const currentCard = mockUsers[currentCardIndex];
    
    if (!currentCard) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-100 relative">
          <div className="text-center">
            <p className="text-xl mb-4">Пока что больше никого нет 😔</p>
            <button 
              onClick={() => setCurrentScreen('matches')}
              className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors"
            >
              Посмотреть совпадения
            </button>
          </div>
          
          {/* Debug button */}
          <button 
            onClick={() => setShowDebug(true)}
            className="absolute top-4 right-4 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center hover:bg-yellow-200 transition-colors"
            title="Отладка"
          >
            🔧
          </button>
          
          <DebugPanel />
        </div>
      );
    }

    return (
      <div className="h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-white shadow-sm">
          <button 
            onClick={() => setCurrentScreen('profile')}
            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            👤
          </button>
          <h1 className="text-xl font-bold text-pink-500">Dating</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowDebug(true)}
              className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center hover:bg-yellow-200 transition-colors"
              title="Отладка"
            >
              🔧
            </button>
            <button 
              onClick={() => setCurrentScreen('matches')}
              className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center relative hover:bg-pink-200 transition-colors"
            >
              💬
              {matches.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {matches.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-96">
              <img 
                src={currentCard.photos[0]} 
                alt={currentCard.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h2 className="text-white text-2xl font-bold">
                  {currentCard.name}, {currentCard.age}
                </h2>
                <p className="text-white/80 text-sm">{currentCard.distance}</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600">{currentCard.bio}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-8 p-6 bg-white">
          <button
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl hover:bg-gray-300 transition-colors active:scale-95"
          >
            ❌
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-2xl hover:bg-pink-600 transition-colors active:scale-95"
          >
            ❤️
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'matches') {
    return (
      <div className="h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white p-4 shadow-sm flex justify-between items-center">
          <div className="w-10"></div>
          <h1 className="text-xl font-bold text-center">Совпадения</h1>
          <button 
            onClick={() => setShowDebug(true)}
            className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center hover:bg-yellow-200 transition-colors"
            title="Отладка"
          >
            🔧
          </button>
        </div>

        {/* Matches List */}
        <div className="p-4">
          {matches.length === 0 ? (
            <div className="text-center mt-20">
              <p className="text-gray-500 text-lg">Пока нет совпадений</p>
              <p className="text-gray-400 mt-2">Продолжайте знакомиться!</p>
              <button 
                onClick={() => setCurrentScreen('swipe')}
                className="mt-4 bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors"
              >
                Вернуться к поиску
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match.id} className="bg-white rounded-lg p-4 shadow-sm flex items-center space-x-4">
                  <img 
                    src={match.photos[0]} 
                    alt={match.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{match.name}, {match.age}</h3>
                    <p className="text-gray-500 text-sm">{match.bio}</p>
                  </div>
                  <button className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm hover:bg-pink-600 transition-colors">
                    Написать
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentScreen === 'profile') {
    return (
      <div className="h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white p-4 shadow-sm flex justify-between items-center">
          <div className="w-10"></div>
          <h1 className="text-xl font-bold text-center">Профиль</h1>
          <button 
            onClick={() => setShowDebug(true)}
            className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center hover:bg-yellow-200 transition-colors"
            title="Отладка"
          >
            🔧
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-4">
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="w-24 h-24 bg-pink-200 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
              👤
            </div>
            <h2 className="text-xl font-bold mb-2">
              {currentUser?.firstName} {currentUser?.lastName}
            </h2>
            {currentUser?.username && (
              <p className="text-gray-500 mb-4">@{currentUser.username}</p>
            )}
            
            <div className="space-y-3 mt-6">
              <button className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors">
                Редактировать профиль
              </button>
              <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors">
                Настройки
              </button>
              <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors">
                Помощь
              </button>
            </div>
          </div>
        </div>
        <DebugPanel />
      </div>
    );
  }

  return (
    <div>
      <div>Экран не найден: {currentScreen}</div>
      <DebugPanel />
    </div>
  );
};

export default DatingApp;