<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a> <a href="https://telegram.org" target="blank"><img src="https://telegram.org/img/t_logo.png" width ="140" alt="Telegram Logo"/></a>
</p>

-------------------

## Description

- Telegram limit by: number of bots in groups upto 20, message sending frequency in group chats
  up to 20 messages per minute in the same chat. So with 1 minute each account can send up to 400 messages. **In short,
  the limit per bot cannot be changed, but with more bots you can send more messages**.
- Based on **Nginx load balancing strategies**, select the appropriate bot to send messages (or perform the tasks you
  want
  with the bot). **Strategies run completely separately for each group and bot**
- Use only effective, consistent and simple strategies to rotate bots.
- Use Cache with redis if you have **more than 1 service**...

-------------------

## Installation

```bash
$ npm install nestjs-telegram-unlimit-message
```

## Quick use

- Using in module:

```typescript
// For root
@Module({
  imports: [
    TelegramModule.forRoot({
      strategy: new RandomStrategy(InputRandomStrategyEnum.BOTH),
      bots: [
        new Bot('bot1', 0),
        new Bot('bot2', 20),
        new Bot('bot3', 100),
        new Bot('bot4', 0),
      ],
    })
  ]
})

// For root async
@Module({
  imports: [
    TelegramModule.forRootAsync({
      useFactory: async (configService: ConfigService, cacheService: CacheService) => ({
        strategy: new WeightedRoundRobinStrategy(),
        bots: [
          new Bot(configService.get('bot1'), 2),
          new Bot(configService.get('bot2')),
          new Bot(configService.get('bot3'), 1),
          new Bot(configService.get('bot4'), 2),
        ],
        cacheService, // [Recommend] CacheService class should have set, get, del methods
      }),
      inject: [ConfigService, CacheService],
    }),
  ],
})
```

- Using in service:

```typescript
@Injectable()
export class TestService {

  constructor(private readonly telegram: TelegramService) {
  }

  getMeBot(): Observable<TelegramUser> {
    return this.telegram.getMe();
  }

  async sendMessage() {
    await lastValueFrom(this.telegramService.sendMessage({
      chat_id: <string | number>('462374324348932034343...'),
      text: <string>job.data.message,
      parse_mode: 'markdown',
    }))
  }
}
```

-------------------

## Strategies

- [Random](#random)
- [Frequency](#frequency)
- [Round Robin](#round-robin)
- [Weighted Round Robin](#weighted-round-robin)

------------------

# Random

- inputRandom : How are proxies random?

```txt
- both : All bots are random
- has_weight : Only the weighted bots will be random
- no_weight : Only bots without weights can be random
```

Config:

```typescript
TelegramModule.forRoot({
  strategy: new RandomStrategy(InputRandomStrategyEnum.BOTH),
  bots: [
    new Bot('bot1', 0),
    new Bot('bot2', 20),
    new Bot('bot3', 100),
    new Bot('bot4', 0),
  ],
})
```

Output(both):

```text
+-------------+-------------+
| bot         | weight      |
+-------------+-------------+
| bot1        | 0           |
| bot2        | 20          |
| bot3        | 100         |
| bot3        | 100         |
+-------------+-------------+
```

----------

## Frequency

More efficient using sort node

```typescript
TelegramModule.forRoot({
  strategy: new FrequencyStrategy(1, 0.4),
  bots: [
    new Bot('bot1', 2048),
    new Bot('bot2', 1024),
    new Bot('bot3', 512),
    new Bot('bot4', 256),
    new Bot('bot5', 64),
    new Bot('bot6', 32),
  ],
})
```

The probability of choosing nodes for Frequency can be visualized as follows::

```text
+--------------+--------+
| bots         | chance |
+--------------+--------+
| bot1         | 40%    |
| bot2         | 40%    |
+--------------+--------+
| bot3         | 2.5%   |
| bot4         | 2.5%   |
| bot5         | 2.5%   |
| bot6         | 2.5%   |
+-----------+-----------+
```

-------------

## Round Robin

The proxies will be rotated in turn (counter : start counting from somewhere)

```typescript
TelegramModule.forRoot({
  strategy: new RoundRobinStrategy(),
  bots: [
    new Bot('bot1', 0),
    new Bot('bot2', 20),
    new Bot('bot3', 100),
    new Bot('bot4', 0),
  ],
})
```

Output:

```text
+-------------+
| bot1        |
| bot2        |
| bot3        |
| bot4        |
| etc...      |
+-------------+
```

* You can interfere with bot usage for a certain period of time if the bot is restricted from
  use.

--------------------

## Weighted Round Robin

The number of times this bot node is called is the weight parameter passed in the initialization of the Bot
(counter : start counting from somewhere)

```typescript
TelegramModule.forRoot({
  strategy: new WeightedRoundRobinStrategy(),
  bots: [
    new Bot('bot1', 1),
    new Bot('bot2', 1),
    new Bot('bot3', 2),
    new Bot('bot4', 0),
  ],
})
```

Output:

```text
+-------------+
| bot1        |
| bot2        |
| bot3        |
| bot3        |
| etc...      |
+-------------+
```

* Bot without weight will not be used

-------------------

## Author

- [Nguyen Quang Truong](https://github.com/truongbo17) - [truongnq017@gmail.com](mailto:truongnq017@gmail.com)

-------------------

## License

Package is [MIT licensed](LICENSE).