use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("ExZPBxvxdgz61raY3BmJ6uBfi3q4JcQ4ixGmCG517idu");

const MAX_MESSAGE_LEN: usize = 128;
const MAX_TODO_LEN: usize = 32;

#[program]
pub mod solana_sample {
    use super::*;

    pub fn create(ctx: Context<CreateAccount>, name: String) -> ProgramResult {
        let data = &mut ctx.accounts.storage;
        data.owner = ctx.accounts.authority.key();
        data.name = name;
        data.todos = [].to_vec();
        Ok(())
    }
    pub fn update_name(ctx: Context<UpdateData>, name: String) -> ProgramResult {
        let data = &mut ctx.accounts.storage;
        data.name = name;
        emit!(UpdateNameEvent {
            owner: data.owner,
            name: data.name.clone()
        });
        Ok(())
    }

    pub fn add_todo(ctx: Context<UpdateData>, title: String, content: String) -> ProgramResult {
        let data = &mut ctx.accounts.storage;
        let todo = Todo {
            title,
            content,
            done: false,
        };
        data.todos.push(todo);
        emit!(UpdateTodoEvent {
            owner: data.owner,
            todos: data.todos.clone()
        });
        Ok(())
    }

    pub fn remove_todo(ctx: Context<UpdateData>, index: u64) -> ProgramResult {
        let idx: usize = index.try_into().unwrap();
        let data = &mut ctx.accounts.storage;
        data.todos.remove(idx);
        emit!(UpdateTodoEvent {
            owner: data.owner,
            todos: data.todos.clone()
        });
        Ok(())
    }

    pub fn update_todo(
        ctx: Context<UpdateData>,
        index: u64,
        title: String,
        content: String,
    ) -> ProgramResult {
        let idx: usize = index.try_into().unwrap();
        let data = &mut ctx.accounts.storage;
        let todo = &mut data.todos[idx];
        todo.title = title;
        todo.content = content;
        emit!(UpdateTodoEvent {
            owner: data.owner,
            todos: data.todos.clone()
        });
        Ok(())
    }

    pub fn update_todo_status(ctx: Context<UpdateData>, index: u64, done: bool) -> ProgramResult {
        let idx: usize = index.try_into().unwrap();
        let data = &mut ctx.accounts.storage;
        let todo = &mut data.todos[idx];
        todo.done = done;
        emit!(UpdateTodoEvent {
            owner: data.owner,
            todos: data.todos.clone()
        });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateAccount<'info> {
    /**
     * Space for the data
     * Name: 4 + Maxlen(name) = 4 + 60 = 64
     * Todo: title + content + done = (4 + 60) + (4 + MAX_MESSAGE_LEN) + 1
     * --> Name + MAX_TODO_LEN * Todo
     */
    #[account(init, seeds = [b"user".as_ref(), authority.key().as_ref()], bump, payer = authority, space = 16 + 64 + ( 4 + MAX_TODO_LEN * (64 + 4 + MAX_MESSAGE_LEN + 1)))]
    pub storage: Account<'info, User>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateData<'info> {
    #[account(mut, has_one = owner)]
    pub storage: Account<'info, User>,

    pub owner: Signer<'info>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Todo {
    pub title: String,
    pub content: String,
    pub done: bool,
}

#[account]
pub struct User {
    pub owner: Pubkey,
    pub name: String,
    pub todos: Vec<Todo>,
}

#[event]
pub struct UpdateTodoEvent {
    pub owner: Pubkey,
    pub todos: Vec<Todo>,
}

#[event]
pub struct UpdateNameEvent {
    pub owner: Pubkey,
    pub name: String,
}
