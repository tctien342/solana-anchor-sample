use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solana_sample {

    use super::*;

    pub fn create(ctx: Context<CreateAccount>) -> ProgramResult {
        let account = &mut ctx.accounts.account_info;
        account.level = 0;
        Ok(())
    }

    pub fn level_up(ctx: Context<LevelUp>) -> ProgramResult {
        let account = &mut ctx.accounts.account_info;
        account.level += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateAccount<'info> {
    #[account(init, payer = user, space = 16 + 8)]
    pub account_info: Account<'info, UserInfo>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}

#[derive(Accounts)]
pub struct LevelUp<'info> {
    #[account(mut)]
    pub account_info: Account<'info, UserInfo>
}


#[account]
pub struct UserInfo {
    pub level: u32
}

