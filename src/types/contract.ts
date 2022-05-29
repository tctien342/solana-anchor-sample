export type SolanaSample = {
  version: '0.1.0';
  name: 'solana_sample';
  instructions: [
    {
      name: 'create';
      accounts: [
        {
          name: 'storage';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'name';
          type: 'string';
        }
      ];
    },
    {
      name: 'updateName';
      accounts: [
        {
          name: 'storage';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'owner';
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: 'name';
          type: 'string';
        }
      ];
    },
    {
      name: 'addTodo';
      accounts: [
        {
          name: 'storage';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'title';
          type: 'string';
        },
        {
          name: 'content';
          type: 'string';
        }
      ];
    },
    {
      name: 'removeTodo';
      accounts: [
        {
          name: 'storage';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'owner';
          isMut: false;
          isSigner: true;
        }
      ];
      args: [];
    },
    {
      name: 'updateTodo';
      accounts: [
        {
          name: 'storage';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'owner';
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: 'title';
          type: 'string';
        },
        {
          name: 'content';
          type: 'string';
        }
      ];
    },
    {
      name: 'updateTodoStatus';
      accounts: [
        {
          name: 'storage';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'owner';
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: 'done';
          type: 'bool';
        }
      ];
    }
  ];
  accounts: [
    {
      name: 'todo';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'owner';
            type: 'publicKey';
          },
          {
            name: 'title';
            type: 'string';
          },
          {
            name: 'content';
            type: 'string';
          },
          {
            name: 'done';
            type: 'bool';
          },
          {
            name: 'removed';
            type: 'bool';
          }
        ];
      };
    },
    {
      name: 'user';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'owner';
            type: 'publicKey';
          },
          {
            name: 'name';
            type: 'string';
          }
        ];
      };
    }
  ];
  events: [
    {
      name: 'UpdateTodoEvent';
      fields: [
        {
          name: 'todo';
          type: {
            defined: 'Todo';
          };
          index: false;
        }
      ];
    },
    {
      name: 'UpdateNameEvent';
      fields: [
        {
          name: 'owner';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'name';
          type: 'string';
          index: false;
        }
      ];
    }
  ];
};

export const IDL: SolanaSample = {
  version: '0.1.0',
  name: 'solana_sample',
  instructions: [
    {
      name: 'create',
      accounts: [
        {
          name: 'storage',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'name',
          type: 'string',
        },
      ],
    },
    {
      name: 'updateName',
      accounts: [
        {
          name: 'storage',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'owner',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'name',
          type: 'string',
        },
      ],
    },
    {
      name: 'addTodo',
      accounts: [
        {
          name: 'storage',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'title',
          type: 'string',
        },
        {
          name: 'content',
          type: 'string',
        },
      ],
    },
    {
      name: 'removeTodo',
      accounts: [
        {
          name: 'storage',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'owner',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: 'updateTodo',
      accounts: [
        {
          name: 'storage',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'owner',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'title',
          type: 'string',
        },
        {
          name: 'content',
          type: 'string',
        },
      ],
    },
    {
      name: 'updateTodoStatus',
      accounts: [
        {
          name: 'storage',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'owner',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'done',
          type: 'bool',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'todo',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'owner',
            type: 'publicKey',
          },
          {
            name: 'title',
            type: 'string',
          },
          {
            name: 'content',
            type: 'string',
          },
          {
            name: 'done',
            type: 'bool',
          },
          {
            name: 'removed',
            type: 'bool',
          },
        ],
      },
    },
    {
      name: 'user',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'owner',
            type: 'publicKey',
          },
          {
            name: 'name',
            type: 'string',
          },
        ],
      },
    },
  ],
  events: [
    {
      name: 'UpdateTodoEvent',
      fields: [
        {
          name: 'todo',
          type: {
            defined: 'Todo',
          },
          index: false,
        },
      ],
    },
    {
      name: 'UpdateNameEvent',
      fields: [
        {
          name: 'owner',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'name',
          type: 'string',
          index: false,
        },
      ],
    },
  ],
};
