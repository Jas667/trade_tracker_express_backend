const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Trade Tracker API",
      version: "1.0.0",
      description: "Trade API Information",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        //Tag schema
        Tag: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "14b85c32-9a4a-4299-8df8-733b30ccf1f9",
            },
            user_id: {
              type: "string",
              format: "uuid",
              example: "14b85c32-9a4a-4299-8df8-733b30ccf1f9",
            },
            tag_name: {
              type: "string",
              example: "Dips",
            },
          },
          required: ["id", "user_id", "tag_name"],
        },
        //Trade schema
        Trade: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "5358eade-57a4-45ae-bc84-da8cc3cdaca2",
            },
            symbol: {
              type: "string",
              example: "TUP",
            },
            status: {
              type: "string",
              enum: ["open", "closed"],
            },
            open_time: {
              type: "string",
              format: "time",
              example: "06:26:14",
            },
            close_time: {
              type: "string",
              format: "time",
              example: "06:27:54",
            },
            open_date: {
              type: "string",
              format: "date",
              example: "2023-08-01",
            },
            close_date: {
              type: "string",
              format: "date",
              example: "2023-08-01",
            },
            user_id: {
              type: "string",
              format: "uuid",
              example: "3735a7f4-46e2-4726-811d-8ef4c5037bdf",
            },
            notes: {
              type: "string",
            },
            profit_loss: {
              type: "number",
              format: "float",
              example: 46.76,
            },
            shares: {
              type: "number",
              format: "integer",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-09-06T07:02:15.810Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2023-09-06T07:02:15.848Z",
            },
          },
        },
        //Trade with some additional properties worked out from trade_details and less properties from trade
        TradeWithAdditionalColumns: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "5358eade-57a4-45ae-bc84-da8cc3cdaca2",
            },
            symbol: {
              type: "string",
              example: "TUP",
            },
            status: {
              type: "string",
              enum: ["open", "closed"],
            },
            open_time: {
              type: "string",
              format: "time",
              example: "06:26:14",
            },
            close_time: {
              type: "string",
              format: "time",
              example: "06:27:54",
            },
            open_date: {
              type: "string",
              format: "date",
              example: "2023-08-01",
            },
            close_date: {
              type: "string",
              format: "date",
              example: "2023-08-01",
            },
            notes: {
              type: "string",
            },
            profit_loss: {
              type: "number",
              format: "float",
              example: 46.76,
            },
            open_price: {
              type: "number",
              format: "float",
              example: 5.45,
            },
            total_shares_traded: {
              type: "number",
              format: "integer",
            },
            total_commission: {
              type: "number",
              format: "decimal",
            },
            gross_profit_loss: {
              type: "number",
              format: "decimal",
            },
            total_fees: {
              type: "number",
              format: "decimal",
            },
          },
        },
        //Trade with Tag schema
        TradeWithTags: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "5358eade-57a4-45ae-bc84-da8cc3cdaca2",
            },
            symbol: {
              type: "string",
              example: "TUP",
            },
            status: {
              type: "string",
              enum: ["open", "closed"],
            },
            open_time: {
              type: "string",
              format: "time",
              example: "06:26:14",
            },
            close_time: {
              type: "string",
              format: "time",
              example: "06:27:54",
            },
            open_date: {
              type: "string",
              format: "date",
              example: "2023-08-01",
            },
            close_date: {
              type: "string",
              format: "date",
              example: "2023-08-01",
            },
            user_id: {
              type: "string",
              format: "uuid",
              example: "3735a7f4-46e2-4726-811d-8ef4c5037bdf",
            },
            notes: {
              type: "string",
            },
            profit_loss: {
              type: "number",
              format: "float",
              example: 46.76,
            },
            shares: {
              type: "number",
              format: "integer",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-09-06T07:02:15.810Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2023-09-06T07:02:15.848Z",
            },
            tags: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Tag",
              },
            },
          },
        },
        //TradeDetails schema
        TradeDetail: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "5358eade-57a4-45ae-bc84-da8cc3cdaca2",
            },
            trade_id: {
              type: "string",
              format: "uuid",
              example: "5358eade-57a4-45ae-bc84-da8cc3cdaca2",
            },
            account: {
              type: "string",
              example: "JOR87712",
            },
            trade_date: {
              type: "string",
              format: "date-time",
              example: "2023-09-06T07:02:15.810Z",
            },
            settlement_date: {
              type: "string",
              format: "date-time",
              example: "2023-09-06T07:02:15.810Z",
            },
            currency: {
              type: "string",
              example: "USD",
            },
            type: {
              type: "integer",
              example: 1,
            },
            side: {
              type: "string",
              enum: ["B", "S"],
              example: "B",
            },
            symbol: {
              type: "string",
              example: "TUP",
            },
            quantity: {
              type: "integer",
              format: "integer",
              example: 100,
            },
            price: {
              type: "number",
              format: "float",
              example: 46.76,
            },
            execution_time: {
              type: "string",
              format: "time",
              example: "06:26:14",
            },
            commission: {
              type: "number",
              format: "decimal",
              nullable: true,
            },
            sec: {
              type: "number",
              format: "decimal",
              nullable: true,
            },
            taf: {
              type: "number",
              format: "decimal",
              nullable: true,
            },
            nscc: {
              type: "number",
              format: "decimal",
              nullable: true,
            },
            nasdaq: {
              type: "number",
              format: "decimal",
              nullable: true,
            },
            ecn_remove: {
              type: "number",
              format: "decimal",
              nullable: true,
            },
            ecn_add: {
              type: "number",
              format: "decimal",
              nullable: true,
            },
            gross_proceeds: {
              type: "number",
              format: "decimal",
              nullable: true,
            },
            net_proceeds: {
              type: "number",
              format: "decimal",
              nullable: true,
            },
            clearing_broker: {
              type: "string",
              nullable: true,
            },
            liquidity: {
              type: "string",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-09-06T07:02:15.810Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2023-09-06T07:02:15.848Z",
            },
          },
        },
        //TradeDetails With Trade schema
        TradeDetailWithTrade: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "5358eade-57a4-45ae-bc84-da8cc3cdaca2",
            },
            trade_id: {
              type: "string",
              format: "uuid",
              example: "5358eade-57a4-45ae-bc84-da8cc3cdaca2",
            },
            account: {
              type: "string",
              example: "JOR87712",
            },
            trade_date: {
              type: "string",
              format: "date-time",
              example: "2023-09-06T07:02:15.810Z",
            },
            settlement_date: {
              type: "string",
              format: "date-time",
              example: "2023-09-06T07:02:15.810Z",
            },
            currency: {
              type: "string",
              example: "USD",
            },
            type: {
              type: "integer",
              example: 1,
            },
            side: {
              type: "string",
              enum: ["B", "S"],
              example: "B",
            },
            symbol: {
              type: "string",
              example: "TUP",
            },
            quantity: {
              type: "integer",
              format: "integer",
              example: 100,
            },
            price: {
              type: "number",
              format: "float",
              example: 46.76,
            },
            execution_time: {
              type: "string",
              format: "time",
              example: "06:26:14",
            },
            commission: {
              type: "number",
              format: "decimal",
              nullable: true,
            },
            sec: {
              type: "number",
              format: "decimal",
              nullable: true,
            },
            taf: {
              type: "number",
              format: "decimal",
              nullable: true,
            },
            nscc: {
              type: "number",
              format: "decimal",
              nullable: true,
            },
            nasdaq: {
              type: "number",
              format: "decimal",
              nullable: true,
            },
            ecn_remove: {
              type: "number",
              format: "decimal",
              nullable: true,
            },
            ecn_add: {
              type: "number",
              format: "decimal",
              nullable: true,
            },
            gross_proceeds: {
              type: "number",
              format: "decimal",
              nullable: true,
            },
            net_proceeds: {
              type: "number",
              format: "decimal",
              nullable: true,
            },
            clearing_broker: {
              type: "string",
              nullable: true,
            },
            liquidity: {
              type: "string",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-09-06T07:02:15.810Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2023-09-06T07:02:15.848Z",
            },
            trade: {
              $ref: "#/components/schemas/Trade",
            },
          },
        },
        // TradeWithDetails schema
        TradeWithDetails: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            symbol: {
              type: "string",
            },
            status: {
              type: "string",
            },
            open_time: {
              type: "string",
            },
            close_time: {
              type: "string",
            },
            open_date: {
              type: "string",
              format: "date",
            },
            close_date: {
              type: "string",
              format: "date",
            },
            user_id: {
              type: "string",
              format: "uuid",
            },
            notes: {
              type: "string",
              nullable: true,
            },
            profit_loss: {
              type: "string",
            },
            shares: {
              type: "integer",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
            trade_details: {
              type: "array",
              items: {
                $ref: "#/components/schemas/TradeDetail",
              },
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerOptions;
