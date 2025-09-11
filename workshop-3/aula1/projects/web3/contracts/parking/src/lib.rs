#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[contracttype]
#[derive(PartialEq, Eq)]
pub enum Status {
    Checkin,
    Checkout,
    Wiched,
}

#[contracttype]
pub struct Ticket {
    pub owner: Address,
    pub start: u32,
    pub end: u32,
    pub status: Status,
}

#[contract]
pub struct ParkingContract;

#[contractimpl]
impl ParkingContract {
    pub fn __constructor() {}

    // fn pay_validation() -> bool {
    //     // 2. Token.allowance(user, 100);
    //     // 3. Token.transferFrom(user, ParkingContractAddress, 100);
    //     return true;
    // }

    // 1. User Token.approve(ParkingContractAddress, 100);
    pub fn store(env: Env, id: u32, user: Address) {
        // if Self::pay_validation() == false {
        //     return symbol_short!("naopagou")
        // }

        user.require_auth();

        let ticket = Ticket {
            owner: user,
            start: env.ledger().sequence(),
            end: env.ledger().sequence() + 60,
            status: Status::Checkin,
        };
        env.storage().temporary().set(&id, &ticket);
        env.storage()
            .temporary()
            .extend_ttl(&id, 10, env.ledger().sequence() + 60);
    }

    pub fn get(env: Env, id: u32) -> Status {
        match env.storage().temporary().get::<u32, Ticket>(&id) {
            Some(ticket) => ticket.status,
            None => Status::Wiched,
        }
    }

    pub fn collect(env: Env, id: u32, user: Address) -> Status {
        user.require_auth();

        let ticket = env.storage().temporary().get::<u32, Ticket>(&id);


        match ticket {
            Some(t) => {
                if t.status == Status::Checkin {
                    let ticket2 = Ticket {
                        owner: t.owner,
                        start: t.start,
                        end: t.end,
                        status: Status::Checkout,
                    };
                    env.storage().temporary().set(&id, &ticket2);
                }
                Status::Checkout
            }
            None => Status::Wiched,
        }
    }
}
