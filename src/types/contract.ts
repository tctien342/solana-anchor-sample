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
      args: [
        {
          name: 'index';
          type: 'u64';
        }
      ];
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
          name: 'index';
          type: 'u64';
        },
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
          name: 'index';
          type: 'u64';
        },
        {
          name: 'done';
          type: 'bool';
        }
      ];
    }
  ];
  accounts: [
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
          },
          {
            name: 'todos';
            type: {
              vec: {
                defined: 'Todo';
              };
            };
          }
        ];
      };
    }
  ];
  types: [
    {
      name: 'Todo';
      type: {
        kind: 'struct';
        fields: [
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
          name: 'owner';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'todos';
          type: {
            vec: {
              defined: 'Todo';
            };
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
      args: [
        {
          name: 'index',
          type: 'u64',
        },
      ],
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
          name: 'index',
          type: 'u64',
        },
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
          name: 'index',
          type: 'u64',
        },
        {
          name: 'done',
          type: 'bool',
        },
      ],
    },
  ],
  accounts: [
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
          {
            name: 'todos',
            type: {
              vec: {
                defined: 'Todo',
              },
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'Todo',
      type: {
        kind: 'struct',
        fields: [
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
        ],
      },
    },
  ],
  events: [
    {
      name: 'UpdateTodoEvent',
      fields: [
        {
          name: 'owner',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'todos',
          type: {
            vec: {
              defined: 'Todo',
            },
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
