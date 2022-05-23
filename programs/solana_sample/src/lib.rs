use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

const MAX_MESSAGE_LEN: usize = 128;
const MAX_TODO_LEN: usize = 32;

#[program]
pub mod solana_sample {
    use super::*;

    pub fn create(ctx: Context<CreateAccount>, name: String) -> ProgramResult {
        let data = &mut ctx.accounts.data;
        data.owner = data.clone().key();
        data.name = name;
        data.notes = [].to_vec();
        Ok(())
    }
    pub fn update_name(ctx: Context<UpdateData>, name: String) -> ProgramResult {
        let data = &mut ctx.accounts.data;
        data.name = name;
        emit!(UpdateNameEvent {
            name: data.name.clone()
        });
        Ok(())
    }

    pub fn add_note(ctx: Context<UpdateData>, title: String, content: String) -> ProgramResult {
        let data = &mut ctx.accounts.data;
        let note = Note {
            title,
            content,
            done: false,
        };
        data.notes.push(note);
        emit!(UpdateNoteEvent {
            notes: data.notes.clone()
        });
        Ok(())
    }

    pub fn remove_note(ctx: Context<UpdateData>, index: u64) -> ProgramResult {
        let idx: usize = index.try_into().unwrap();
        let data = &mut ctx.accounts.data;
        data.notes.remove(idx);
        emit!(UpdateNoteEvent {
            notes: data.notes.clone()
        });
        Ok(())
    }

    pub fn update_note_title(ctx: Context<UpdateData>, index: u64, title: String) -> ProgramResult {
        let idx: usize = index.try_into().unwrap();
        let data = &mut ctx.accounts.data;
        let note = &mut data.notes[idx];
        note.title = title;
        emit!(UpdateNoteEvent {
            notes: data.notes.clone()
        });
        Ok(())
    }

    pub fn update_note_content(
        ctx: Context<UpdateData>,
        index: u64,
        content: String,
    ) -> ProgramResult {
        let idx: usize = index.try_into().unwrap();
        let data = &mut ctx.accounts.data;
        let note = &mut data.notes[idx];
        note.content = content;
        emit!(UpdateNoteEvent {
            notes: data.notes.clone()
        });
        Ok(())
    }

    pub fn update_note_status(ctx: Context<UpdateData>, index: u64, done: bool) -> ProgramResult {
        let idx: usize = index.try_into().unwrap();
        let data = &mut ctx.accounts.data;
        let note = &mut data.notes[idx];
        note.done = done;
        emit!(UpdateNoteEvent {
            notes: data.notes.clone()
        });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateAccount<'info> {
    /**
     * Space for the data
     * Name: 4 + Maxlen(name) = 4 + 60 = 64
     * Note: title + content + done = (4 + 60) + (4 + MAX_MESSAGE_LEN) + 1
     * --> Name + MAX_TODO_LEN * Note
     */
    #[account(init, payer = user, space = 16 + 64 + ( 4 + MAX_TODO_LEN * (64 + 4 + MAX_MESSAGE_LEN + 1)))]
    pub data: Account<'info, User>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateData<'info> {
    #[account(mut, has_one = owner)]
    pub data: Account<'info, User>,
    pub owner: Signer<'info>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Note {
    pub title: String,
    pub content: String,
    pub done: bool,
}

#[account]
pub struct User {
    pub owner: Pubkey,
    pub name: String,
    pub notes: Vec<Note>,
}

#[event]
pub struct UpdateNoteEvent {
    pub notes: Vec<Note>,
}

#[event]
pub struct UpdateNameEvent {
    pub name: String,
}
