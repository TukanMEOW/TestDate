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
    photos: ["keys/maria1?prompt=Artistic%20young%20woman%20with%20creative%20style%2C%20portrait"],
    distance: "5 км"
  },
  {
    id: 3,
    name: "Елена",
    age: 27,
    bio: "Йога, здоровый образ жизни 🧘‍♀️",
    photos: ["keys/elena1?prompt=Sporty%20young%20woman%20practicing%20yoga%2C%20healthy%20lifestyle"],
    distance: "1 км"
  }
];

const DatingApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Инициализация Telegram WebApp
  useEffect(() => {
    const initTelegram = async () => {
      try {
        // Проверяем наличие Telegram WebApp
        if (window.Telegram && window.Telegram.WebApp) {
          const tg = window.Telegram.WebApp;
          
          // Настройка WebApp
          tg.ready();
          tg.expand();
          
          // Получаем данные пользователя
          if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            const user = tg.initDataUnsafe.user;
            setCurrentUser({
              id: user.id,
              firstName: user.first_name,
              lastName: user.last_name,
              username: user.username,
              photoUrl: user.photo_url
            });
          } else {
            // Fallback для тестирования
            setCurrentUser({
              id: 12345,
              firstName: "Тестовый",
              lastName: "Пользователь",
              username: "testuser"
            });
          }
          
          // Настройка кнопки назад
          tg.BackButton.onClick(() => {
            if (currentScreen === 'matches' || currentScreen === 'profile') {
              setCurrentScreen('swipe');
            }
          });
          
        } else {
          // Fallback для разработки вне Telegram
          setCurrentUser({
            id: 12345,
            firstName: "Тестовый",
            lastName: "Пользователь",
            username: "testuser"
          });
        }
        
        setCurrentScreen('swipe');
        setIsInitialized(true);
        
      } catch (error) {
        console.error('Ошибка инициализации Telegram WebApp:', error);
        // Для разработки продолжаем без Telegram
        setCurrentUser({
          id: 12345,
          firstName: "Тестовый",
          lastName: "Пользователь"
        });
        setCurrentScreen('swipe');
        setIsInitialized(true);
      }
    };

    initTelegram();
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

  if (currentScreen === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-pink-400 to-purple-600">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl">Загружаем приложение...</p>
        </div>
      </div>
    );
  }

  if (currentScreen === 'swipe') {
    const currentCard = mockUsers[currentCardIndex];
    
    if (!currentCard) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="text-center">
            <p className="text-xl mb-4">Пока что больше никого нет 😔</p>
            <button 
              onClick={() => setCurrentScreen('matches')}
              className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors"
            >
              Посмотреть совпадения
            </button>
          </div>
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
        <div className="bg-white p-4 shadow-sm">
          <h1 className="text-xl font-bold text-center">Совпадения</h1>
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
        <div className="bg-white p-4 shadow-sm">
          <h1 className="text-xl font-bold text-center">Профиль</h1>
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
      </div>
    );
  }

  return null;
};

export default DatingApp;