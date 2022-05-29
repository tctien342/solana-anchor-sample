use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("ExZPBxvxdgz61raY3BmJ6uBfi3q4JcQ4ixGmCG517idu");
const MAX_MESSAGE_LEN: usize = 128;

#[program]
pub mod solana_sample {
    use super::*;

    pub fn create(ctx: Context<CreateAccount>, name: String) -> ProgramResult {
        let data = &mut ctx.accounts.storage;
        data.owner = ctx.accounts.authority.key();
        data.name = name;
        Ok(())
    }
    pub fn update_name(ctx: Context<UpdateUserInfo>, name: String) -> ProgramResult {
        let data = &mut ctx.accounts.storage;
        data.name = name;
        emit!(UpdateNameEvent {
            owner: data.owner,
            name: data.name.clone()
        });
        Ok(())
    }

    pub fn add_todo(ctx: Context<CreateTodo>, title: String, content: String) -> ProgramResult {
        let data = &mut ctx.accounts.storage;
        data.title = title;
        data.content = content;
        data.done = false;
        data.removed = false;
        data.owner = ctx.accounts.authority.key();

        emit!(UpdateTodoEvent {
            title: data.title.clone(),
            owner: data.owner,
            content: data.content.clone(),
            done: data.done,
        });
        Ok(())
    }

    pub fn remove_todo(ctx: Context<RemoveTodo>) -> ProgramResult {
        let data = &mut ctx.accounts.storage;
        data.removed = true;

        // // Remove all current lamports of todo account
        // let current_lamports = ctx.accounts.storage.to_account_info().lamports();
        // let ix = anchor_lang::solana_program::system_instruction::transfer(
        //     &ctx.accounts.storage.key(),
        //     &ctx.accounts.owner.key(),
        //     current_lamports,
        // );
        // anchor_lang::solana_program::program::invoke(
        //     &ix,
        //     &[
        //         ctx.accounts.storage.to_account_info(),
        //         ctx.accounts.owner.to_account_info(),
        //     ],
        // )
        // .unwrap();

        Ok(())
    }

    pub fn update_todo(ctx: Context<UpdateTodo>, title: String, content: String) -> ProgramResult {
        let data = &mut ctx.accounts.storage;
        data.title = title;
        data.content = content;
        emit!(UpdateTodoEvent {
            title: data.title.clone(),
            owner: data.owner,
            content: data.content.clone(),
            done: data.done,
        });
        Ok(())
    }

    pub fn update_todo_status(ctx: Context<UpdateTodo>, done: bool) -> ProgramResult {
        let data = &mut ctx.accounts.storage;
        data.done = done;
        emit!(UpdateTodoEvent {
            title: data.title.clone(),
            owner: data.owner,
            content: data.content.clone(),
            done: data.done,
        });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateAccount<'info> {
    /**
     * Space for the data
     * Name: 4 + Maxlen(name) = 4 + 60 = 64
     * --> Anchor + Ownder + Name = 8 + 32 + 64
     */
    #[account(init, seeds = [b"user".as_ref(), authority.key().as_ref()], bump, payer = authority, space = 8 + 32 + 64)]
    pub storage: Account<'info, User>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateTodo<'info> {
    /**
     * Space for the data
     * Name: 4 + Maxlen(name) = 4 + 60 = 64
     * Todo: title + content + done = (4 + 60) + (4 + MAX_MESSAGE_LEN) + 1
     * --> Anchor + Owner + Todo = 8 + 32 + Todo
     */
    #[account(init, payer = authority, space = 8 + 32 + 64 + MAX_MESSAGE_LEN + 4 + 1)]
    pub storage: Account<'info, Todo>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateUserInfo<'info> {
    #[account(mut, has_one = owner)]
    pub storage: Account<'info, User>,

    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateTodo<'info> {
    #[account(mut, has_one = owner)]
    pub storage: Account<'info, Todo>,

    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct RemoveTodo<'info> {
    #[account(mut, has_one = owner, close=owner)]
    pub storage: Account<'info, Todo>,

    pub owner: Signer<'info>,
}

#[account]
pub struct Todo {
    pub owner: Pubkey,
    pub title: String,
    pub content: String,
    pub done: bool,
    pub removed: bool,
}

#[account]
pub struct User {
    pub owner: Pubkey,
    pub name: String,
}

#[event]
pub struct UpdateTodoEvent {
    pub owner: Pubkey,
    pub title: String,
    pub content: String,
    pub done: bool,
}

#[event]
pub struct UpdateNameEvent {
    pub owner: Pubkey,
    pub name: String,
}
