<p align="center">
  <img src="https://i.imgur.com/fUZuVz7.png" height="100px">
  <h3 align="center">Dota2 Market Analytics — Server</h3>
</p>

<p align="center">
  <sup>
    Сервер для веб-приложения Dota2 Market Analytics.
  </sup>
</p>

</br>

## 💡 Требования
### 1. База данных - MongoDB
<sup>
Для сохранения информации о предметах, пользователях, имеющихся и проданных предметах требуется база данных MongoDB, ссылку на базу данных указать в окружении <b>.env → MONGO_DB=</b> 
</sup>

### 2. Steam Cookie
<sup>
Для обновления информации о ценах на торговой площадке через API Steam требуется токен авторизации. Одним из простейших способов узнать свой токен (steamLoginSecure) отправить любой запрос в Steam, например https://steamcommunity.com/market, 
зайти в <b>Cookie → steamLoginSecure</b>, скопировать этот токен и указать в окружении <b>.env → STEAM_COOKIE</b>. Куки требуется обновлять ежедневно, пока не будет добавлено автообновление.
</sup>

### 3. Прокси
<sup>
API Steam имеет ограничения на количество запросов в минуту, для того чтобы обойти эти ограничения, требуется указать список своих прокси в переменной <b>utils/constants.js → ProxyList</b>.
</sup>

</br>

## 📦 Технологии
    1.  axios-https-proxy-fix
    2.  bcrypt
    3.  cors
    4.  express
    5.  express-validator
    6.  jsonwebtoken
    7.  mongodb
    8.  mongoose
    9.  nodemon
    10. winston

## 📁 Установка
<sup><b>
Для работы приложения требуется база данных MongoDB, токен Steam и работающие прокси. 
</b></sup>
```
$ git clone https://github.com/em1png/Dota2-MarketAnalytics-Server
$ cd Dota2-MarketAnalytics-Server
$ npm install
$ npm start
```
