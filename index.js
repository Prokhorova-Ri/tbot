const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')
const token = '6119820895:AAGo4gKkeuvGFUQRSyo6uWRuEESMbzsdvY4';

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас загадаю число от 0 до 9. а ты должен отгадать!`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
        {command: '/info', description: 'Получить инфо'},
        {command: '/game', description: 'Игра "Угадай цифру"'}
    ]);

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendMessage(chatId, `Добро пожаловать!`)
            return bot.sendSticker(chatId, 'https://i.gifer.com/Be.gif')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Вас зовут:  ${msg.from.first_name}  ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, `Не понимаю...`);
    })
    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId].toString()) {
            return bot.sendMessage(chatId, `Поздравляю, ты угадал цифру ${chats[chatId]}`)
        } else {
            return bot.sendMessage(chatId, `Ошибочка :) Я  загадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start();
