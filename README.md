<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a> <a href="https://telegram.org" target="blank"><img src="https://telegram.org/img/t_logo.png" width ="140" alt="Telegram Logo"/></a>
</p>

-------------------

## Description

- [Telegram](https://telegram.org) API wrapper for the Telegram Bots API made to work with
  the [Nest](https://github.com/nestjs/nest) framework.
- Based on Nginx load balancing strategies, select the appropriate bot to send messages (or perform the tasks you want
  with the bot)
- Use only effective, consistent and simple strategies to rotate proxies

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
      useFactory: async (configService: ConfigService) => ({
        strategy: new WeightedRoundRobinStrategy(),
        bots: [
          new Bot(configService.get('bot1'), 2),
          new Bot(configService.get('bot2')),
          new Bot(configService.get('bot3'), 1),
          new Bot(configService.get('bot4'), 2),
        ],
      }),
      inject: [ConfigService],
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
- both : All proxy nodes are random
- has_weight : Only the weighted proxy node will be random
- no_weight : Only proxy nodes without weights can be random
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

* You can interfere with proxy usage for a certain period of time if the proxy is restricted from
  use.

--------------------

## Weighted Round Robin

The number of times this proxy node is called is the weight parameter passed in the initialization of the ProxyNode
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

* Proxy Node without weight will not be used

-------------------

## Author

- [Nguyen Quang Truong](https://github.com/truongbo17)

-------------------

## License

Package is [MIT licensed](LICENSE).