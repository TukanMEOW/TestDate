// <stdin>
import React, { useState, useEffect } from "https://esm.sh/react@18.2.0";
var mockUsers = [
  {
    id: 1,
    name: "\u0410\u043D\u043D\u0430",
    age: 25,
    bio: "\u041B\u044E\u0431\u043B\u044E \u043F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u044F \u0438 \u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u044E \u{1F4F8}",
    photos: ["assets/anna1.jpeg?prompt=Beautiful%20young%20woman%20smiling%2C%20portrait%20photo"],
    distance: "2 \u043A\u043C"
  },
  {
    id: 2,
    name: "\u041C\u0430\u0440\u0438\u044F",
    age: 23,
    bio: "\u0425\u0443\u0434\u043E\u0436\u043D\u0438\u0446\u0430 \u0438 \u043B\u044E\u0431\u0438\u0442\u0435\u043B\u044C\u043D\u0438\u0446\u0430 \u043A\u043E\u0444\u0435 \u2615",
    photos: ["keys/maria1?prompt=Artistic%20young%20woman%20with%20creative%20style%2C%20portrait"],
    distance: "5 \u043A\u043C"
  },
  {
    id: 3,
    name: "\u0415\u043B\u0435\u043D\u0430",
    age: 27,
    bio: "\u0419\u043E\u0433\u0430, \u0437\u0434\u043E\u0440\u043E\u0432\u044B\u0439 \u043E\u0431\u0440\u0430\u0437 \u0436\u0438\u0437\u043D\u0438 \u{1F9D8}\u200D\u2640\uFE0F",
    photos: ["keys/elena1?prompt=Sporty%20young%20woman%20practicing%20yoga%2C%20healthy%20lifestyle"],
    distance: "1 \u043A\u043C"
  }
];
var DatingApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState("loading");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    const initTelegram = async () => {
      try {
        if (window.Telegram && window.Telegram.WebApp) {
          const tg = window.Telegram.WebApp;
          tg.ready();
          tg.expand();
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
            setCurrentUser({
              id: 12345,
              firstName: "\u0422\u0435\u0441\u0442\u043E\u0432\u044B\u0439",
              lastName: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",
              username: "testuser"
            });
          }
          tg.BackButton.onClick(() => {
            if (currentScreen === "matches" || currentScreen === "profile") {
              setCurrentScreen("swipe");
            }
          });
        } else {
          setCurrentUser({
            id: 12345,
            firstName: "\u0422\u0435\u0441\u0442\u043E\u0432\u044B\u0439",
            lastName: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",
            username: "testuser"
          });
        }
        setCurrentScreen("swipe");
        setIsInitialized(true);
      } catch (error) {
        console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438 Telegram WebApp:", error);
        setCurrentUser({
          id: 12345,
          firstName: "\u0422\u0435\u0441\u0442\u043E\u0432\u044B\u0439",
          lastName: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C"
        });
        setCurrentScreen("swipe");
        setIsInitialized(true);
      }
    };
    initTelegram();
  }, []);
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      if (currentScreen === "matches" || currentScreen === "profile") {
        tg.BackButton.show();
      } else {
        tg.BackButton.hide();
      }
    }
  }, [currentScreen]);
  const handleSwipe = (direction) => {
    try {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred("light");
      }
    } catch (e) {
      console.log("Haptic feedback not available");
    }
    if (direction === "right") {
      if (Math.random() > 0.5) {
        setMatches((prev) => [...prev, mockUsers[currentCardIndex]]);
        try {
          if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
          }
        } catch (e) {
          console.log("Haptic feedback not available");
        }
      }
    }
    if (currentCardIndex < mockUsers.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentScreen("matches");
    }
  };
  if (currentScreen === "loading") {
    return /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center h-screen bg-gradient-to-br from-pink-400 to-purple-600" }, /* @__PURE__ */ React.createElement("div", { className: "text-center text-white" }, /* @__PURE__ */ React.createElement("div", { className: "animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4" }), /* @__PURE__ */ React.createElement("p", { className: "text-xl" }, "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043C \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435...")));
  }
  if (currentScreen === "swipe") {
    const currentCard = mockUsers[currentCardIndex];
    if (!currentCard) {
      return /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center h-screen bg-gray-100" }, /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("p", { className: "text-xl mb-4" }, "\u041F\u043E\u043A\u0430 \u0447\u0442\u043E \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0438\u043A\u043E\u0433\u043E \u043D\u0435\u0442 \u{1F614}"), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => setCurrentScreen("matches"),
          className: "bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors"
        },
        "\u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u044F"
      )));
    }
    return /* @__PURE__ */ React.createElement("div", { className: "h-screen bg-gray-100 flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center p-4 bg-white shadow-sm" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setCurrentScreen("profile"),
        className: "w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
      },
      "\u{1F464}"
    ), /* @__PURE__ */ React.createElement("h1", { className: "text-xl font-bold text-pink-500" }, "Dating"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setCurrentScreen("matches"),
        className: "w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center relative hover:bg-pink-200 transition-colors"
      },
      "\u{1F4AC}",
      matches.length > 0 && /* @__PURE__ */ React.createElement("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" }, matches.length)
    )), /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "relative h-96" }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: currentCard.photos[0],
        alt: currentCard.name,
        className: "w-full h-full object-cover"
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4" }, /* @__PURE__ */ React.createElement("h2", { className: "text-white text-2xl font-bold" }, currentCard.name, ", ", currentCard.age), /* @__PURE__ */ React.createElement("p", { className: "text-white/80 text-sm" }, currentCard.distance))), /* @__PURE__ */ React.createElement("div", { className: "p-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, currentCard.bio)))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-center space-x-8 p-6 bg-white" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => handleSwipe("left"),
        className: "w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl hover:bg-gray-300 transition-colors active:scale-95"
      },
      "\u274C"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => handleSwipe("right"),
        className: "w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-2xl hover:bg-pink-600 transition-colors active:scale-95"
      },
      "\u2764\uFE0F"
    )));
  }
  if (currentScreen === "matches") {
    return /* @__PURE__ */ React.createElement("div", { className: "h-screen bg-gray-100" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-4 shadow-sm" }, /* @__PURE__ */ React.createElement("h1", { className: "text-xl font-bold text-center" }, "\u0421\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u044F")), /* @__PURE__ */ React.createElement("div", { className: "p-4" }, matches.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "text-center mt-20" }, /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 text-lg" }, "\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0439"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 mt-2" }, "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0439\u0442\u0435 \u0437\u043D\u0430\u043A\u043E\u043C\u0438\u0442\u044C\u0441\u044F!"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setCurrentScreen("swipe"),
        className: "mt-4 bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors"
      },
      "\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043A \u043F\u043E\u0438\u0441\u043A\u0443"
    )) : /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, matches.map((match) => /* @__PURE__ */ React.createElement("div", { key: match.id, className: "bg-white rounded-lg p-4 shadow-sm flex items-center space-x-4" }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: match.photos[0],
        alt: match.name,
        className: "w-16 h-16 rounded-full object-cover"
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold" }, match.name, ", ", match.age), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 text-sm" }, match.bio)), /* @__PURE__ */ React.createElement("button", { className: "bg-pink-500 text-white px-4 py-2 rounded-full text-sm hover:bg-pink-600 transition-colors" }, "\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C"))))));
  }
  if (currentScreen === "profile") {
    return /* @__PURE__ */ React.createElement("div", { className: "h-screen bg-gray-100" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-4 shadow-sm" }, /* @__PURE__ */ React.createElement("h1", { className: "text-xl font-bold text-center" }, "\u041F\u0440\u043E\u0444\u0438\u043B\u044C")), /* @__PURE__ */ React.createElement("div", { className: "p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg p-6 shadow-sm text-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-24 h-24 bg-pink-200 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl" }, "\u{1F464}"), /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold mb-2" }, currentUser?.firstName, " ", currentUser?.lastName), currentUser?.username && /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 mb-4" }, "@", currentUser.username), /* @__PURE__ */ React.createElement("div", { className: "space-y-3 mt-6" }, /* @__PURE__ */ React.createElement("button", { className: "w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors" }, "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u0444\u0438\u043B\u044C"), /* @__PURE__ */ React.createElement("button", { className: "w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors" }, "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438"), /* @__PURE__ */ React.createElement("button", { className: "w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors" }, "\u041F\u043E\u043C\u043E\u0449\u044C")))));
  }
  return null;
};
var stdin_default = DatingApp;
export {
  stdin_default as default
};
