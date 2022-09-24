use cozy_chess::{Board, Move, Square};

pub fn book_entry(board: &Board) -> &[Move] {
    match board.hash() {
        3188564463534973100 => &[Move {
            from: Square::F6,
            to: Square::D5,
            promotion: None,
        }],
        15153007871403852462 => &[
            Move {
                from: Square::D7,
                to: Square::D5,
                promotion: None,
            },
            Move {
                from: Square::F6,
                to: Square::E4,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
        ],
        9811845504473192586 => &[
            Move {
                from: Square::E7,
                to: Square::E5,
                promotion: None,
            },
            Move {
                from: Square::C7,
                to: Square::C5,
                promotion: None,
            },
            Move {
                from: Square::G7,
                to: Square::G6,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
        ],
        4049537286002821512 => &[
            Move {
                from: Square::C7,
                to: Square::C5,
                promotion: None,
            },
            Move {
                from: Square::G7,
                to: Square::G6,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
        ],
        15360223399059890869 => &[
            Move {
                from: Square::C7,
                to: Square::C5,
                promotion: None,
            },
            Move {
                from: Square::G7,
                to: Square::G6,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
        ],
        14399607066331192282 => &[Move {
            from: Square::G7,
            to: Square::G6,
            promotion: None,
        }],
        3543124347136418472 => &[
            Move {
                from: Square::B1,
                to: Square::C3,
                promotion: None,
            },
            Move {
                from: Square::G2,
                to: Square::G3,
                promotion: None,
            },
        ],
        16789173519384213494 => &[
            Move {
                from: Square::D7,
                to: Square::D6,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E5,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
            Move {
                from: Square::C7,
                to: Square::C5,
                promotion: None,
            },
            Move {
                from: Square::G7,
                to: Square::G6,
                promotion: None,
            },
        ],
        425450683713723595 => &[
            Move {
                from: Square::D7,
                to: Square::D6,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E5,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
            Move {
                from: Square::C7,
                to: Square::C5,
                promotion: None,
            },
            Move {
                from: Square::G7,
                to: Square::G6,
                promotion: None,
            },
        ],
        6638171745861564705 => &[Move {
            from: Square::D7,
            to: Square::D5,
            promotion: None,
        }],
        17007829959896098851 => &[
            Move {
                from: Square::D7,
                to: Square::D6,
                promotion: None,
            },
            Move {
                from: Square::D7,
                to: Square::D5,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
            Move {
                from: Square::C7,
                to: Square::C5,
                promotion: None,
            },
            Move {
                from: Square::G7,
                to: Square::G6,
                promotion: None,
            },
        ],
        15119645142293272939 => &[
            Move {
                from: Square::G7,
                to: Square::G6,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
        ],
        16509808493707199235 => &[
            Move {
                from: Square::C2,
                to: Square::C4,
                promotion: None,
            },
            Move {
                from: Square::G1,
                to: Square::F3,
                promotion: None,
            },
            Move {
                from: Square::B1,
                to: Square::C3,
                promotion: None,
            },
            Move {
                from: Square::C1,
                to: Square::G5,
                promotion: None,
            },
        ],
        14163359918520498670 => &[Move {
            from: Square::D7,
            to: Square::D5,
            promotion: None,
        }],
        9047526714176078796 => &[
            Move {
                from: Square::E4,
                to: Square::E5,
                promotion: None,
            },
            Move {
                from: Square::B1,
                to: Square::C3,
                promotion: None,
            },
        ],
        3878557718609051005 => &[
            Move {
                from: Square::C2,
                to: Square::C4,
                promotion: None,
            },
            Move {
                from: Square::D2,
                to: Square::D4,
                promotion: None,
            },
            Move {
                from: Square::G2,
                to: Square::G3,
                promotion: None,
            },
        ],
        14064034881247118351 => &[
            Move {
                from: Square::D7,
                to: Square::D5,
                promotion: None,
            },
            Move {
                from: Square::G7,
                to: Square::G6,
                promotion: None,
            },
        ],
        1855212665273456938 => &[Move {
            from: Square::C8,
            to: Square::B7,
            promotion: None,
        }],
        2624257230176626786 => &[Move {
            from: Square::C8,
            to: Square::B7,
            promotion: None,
        }],
        13865350255026818164 => &[Move {
            from: Square::D2,
            to: Square::D4,
            promotion: None,
        }],
        5958794490123840467 => &[Move {
            from: Square::D7,
            to: Square::D5,
            promotion: None,
        }],
        8027052939076000411 => &[Move {
            from: Square::D7,
            to: Square::D5,
            promotion: None,
        }],
        3631143577528812719 => &[Move {
            from: Square::D7,
            to: Square::D5,
            promotion: None,
        }],
        9402421924846196141 => &[Move {
            from: Square::D7,
            to: Square::D5,
            promotion: None,
        }],
        10044558282669047437 => &[
            Move {
                from: Square::G1,
                to: Square::F3,
                promotion: None,
            },
            Move {
                from: Square::D2,
                to: Square::D4,
                promotion: None,
            },
            Move {
                from: Square::B1,
                to: Square::C3,
                promotion: None,
            },
        ],
        12912665070690996789 => &[Move {
            from: Square::B8,
            to: Square::C6,
            promotion: None,
        }],
        228405137874813751 => &[
            Move {
                from: Square::B8,
                to: Square::C6,
                promotion: None,
            },
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
        ],
        17164295955321284618 => &[
            Move {
                from: Square::B8,
                to: Square::C6,
                promotion: None,
            },
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
        ],
        734677339226007575 => &[Move {
            from: Square::B1,
            to: Square::C3,
            promotion: None,
        }],
        16657328884079264554 => &[Move {
            from: Square::B1,
            to: Square::C3,
            promotion: None,
        }],
        11475872125563214893 => &[Move {
            from: Square::C5,
            to: Square::D4,
            promotion: None,
        }],
        11715633942001560933 => &[Move {
            from: Square::C5,
            to: Square::D4,
            promotion: None,
        }],
        18417454431196525393 => &[
            Move {
                from: Square::B8,
                to: Square::C6,
                promotion: None,
            },
            Move {
                from: Square::D7,
                to: Square::D6,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
        ],
        3257981213764855624 => &[
            Move {
                from: Square::D7,
                to: Square::D5,
                promotion: None,
            },
            Move {
                from: Square::D7,
                to: Square::D6,
                promotion: None,
            },
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
        ],
        5732946043640685139 => &[
            Move {
                from: Square::D7,
                to: Square::D6,
                promotion: None,
            },
            Move {
                from: Square::A7,
                to: Square::A6,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
            Move {
                from: Square::B8,
                to: Square::C6,
                promotion: None,
            },
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
            Move {
                from: Square::G7,
                to: Square::G6,
                promotion: None,
            },
        ],
        5086508379066616179 => &[
            Move {
                from: Square::C2,
                to: Square::C3,
                promotion: None,
            },
            Move {
                from: Square::G1,
                to: Square::F3,
                promotion: None,
            },
            Move {
                from: Square::B1,
                to: Square::C3,
                promotion: None,
            },
            Move {
                from: Square::D2,
                to: Square::D4,
                promotion: None,
            },
        ],
        12361898376322490958 => &[
            Move {
                from: Square::C2,
                to: Square::C3,
                promotion: None,
            },
            Move {
                from: Square::G1,
                to: Square::F3,
                promotion: None,
            },
            Move {
                from: Square::B1,
                to: Square::C3,
                promotion: None,
            },
            Move {
                from: Square::D2,
                to: Square::D4,
                promotion: None,
            },
        ],
        1065886662171064258 => &[Move {
            from: Square::C2,
            to: Square::C4,
            promotion: None,
        }],
        16416301505666489599 => &[Move {
            from: Square::C2,
            to: Square::C4,
            promotion: None,
        }],
        2186307960948091632 => &[Move {
            from: Square::E2,
            to: Square::E4,
            promotion: None,
        }],
        6850570732440403809 => &[
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
            Move {
                from: Square::G7,
                to: Square::G6,
                promotion: None,
            },
        ],
        7117424450576813609 => &[
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
            Move {
                from: Square::G7,
                to: Square::G6,
                promotion: None,
            },
        ],
        18064612567311023643 => &[Move {
            from: Square::G8,
            to: Square::F6,
            promotion: None,
        }],
        9711600587234929215 => &[Move {
            from: Square::D2,
            to: Square::D4,
            promotion: None,
        }],
        12072328502952391827 => &[
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
            Move {
                from: Square::C7,
                to: Square::C6,
                promotion: None,
            },
        ],
        5373119501006184366 => &[
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
            Move {
                from: Square::C7,
                to: Square::C6,
                promotion: None,
            },
        ],
        8594132697547492077 => &[
            Move {
                from: Square::C7,
                to: Square::C6,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E5,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
            Move {
                from: Square::D5,
                to: Square::C4,
                promotion: None,
            },
            Move {
                from: Square::B8,
                to: Square::C6,
                promotion: None,
            },
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
        ],
        11123010783017771472 => &[
            Move {
                from: Square::C7,
                to: Square::C6,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E5,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
            Move {
                from: Square::D5,
                to: Square::C4,
                promotion: None,
            },
            Move {
                from: Square::B8,
                to: Square::C6,
                promotion: None,
            },
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
        ],
        10256228777478911250 => &[Move {
            from: Square::G8,
            to: Square::F6,
            promotion: None,
        }],
        8339731133750269240 => &[
            Move {
                from: Square::C7,
                to: Square::C6,
                promotion: None,
            },
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
            Move {
                from: Square::B8,
                to: Square::C6,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
        ],
        5649936557326525552 => &[Move {
            from: Square::G8,
            to: Square::F6,
            promotion: None,
        }],
        8837682192395812376 => &[
            Move {
                from: Square::C2,
                to: Square::C4,
                promotion: None,
            },
            Move {
                from: Square::G1,
                to: Square::F3,
                promotion: None,
            },
            Move {
                from: Square::C1,
                to: Square::F4,
                promotion: None,
            },
        ],
        5148167684924346192 => &[
            Move {
                from: Square::C2,
                to: Square::C4,
                promotion: None,
            },
            Move {
                from: Square::G1,
                to: Square::F3,
                promotion: None,
            },
            Move {
                from: Square::C1,
                to: Square::F4,
                promotion: None,
            },
        ],
        16299683630932541143 => &[Move {
            from: Square::E4,
            to: Square::D5,
            promotion: None,
        }],
        16131944433640279967 => &[Move {
            from: Square::E4,
            to: Square::D5,
            promotion: None,
        }],
        12279127921089806438 => &[
            Move {
                from: Square::C2,
                to: Square::C4,
                promotion: None,
            },
            Move {
                from: Square::D2,
                to: Square::D4,
                promotion: None,
            },
            Move {
                from: Square::G2,
                to: Square::G3,
                promotion: None,
            },
        ],
        10933631396872204590 => &[
            Move {
                from: Square::C2,
                to: Square::C4,
                promotion: None,
            },
            Move {
                from: Square::D2,
                to: Square::D4,
                promotion: None,
            },
            Move {
                from: Square::G2,
                to: Square::G3,
                promotion: None,
            },
        ],
        6671558718994856212 => &[
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
            Move {
                from: Square::C7,
                to: Square::C6,
                promotion: None,
            },
        ],
        2002520364709489921 => &[
            Move {
                from: Square::D8,
                to: Square::D5,
                promotion: None,
            },
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
        ],
        11720639940490407970 => &[Move {
            from: Square::D7,
            to: Square::D5,
            promotion: None,
        }],
        1993136125913745920 => &[Move {
            from: Square::B1,
            to: Square::C3,
            promotion: None,
        }],
        14014531551745187678 => &[
            Move {
                from: Square::D7,
                to: Square::D5,
                promotion: None,
            },
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
            Move {
                from: Square::F7,
                to: Square::F5,
                promotion: None,
            },
        ],
        3415205478756054115 => &[
            Move {
                from: Square::D7,
                to: Square::D5,
                promotion: None,
            },
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
            Move {
                from: Square::F7,
                to: Square::F5,
                promotion: None,
            },
        ],
        14304924805656641675 => &[Move {
            from: Square::G8,
            to: Square::F6,
            promotion: None,
        }],
        14959868584156326827 => &[
            Move {
                from: Square::C2,
                to: Square::C4,
                promotion: None,
            },
            Move {
                from: Square::G1,
                to: Square::F3,
                promotion: None,
            },
            Move {
                from: Square::E2,
                to: Square::E4,
                promotion: None,
            },
        ],
        10293381017520487994 => &[Move {
            from: Square::D7,
            to: Square::D5,
            promotion: None,
        }],
        12902066799231438706 => &[Move {
            from: Square::D7,
            to: Square::D5,
            promotion: None,
        }],
        3132561257247539008 => &[Move {
            from: Square::D7,
            to: Square::D5,
            promotion: None,
        }],
        5450944377621275069 => &[Move {
            from: Square::D7,
            to: Square::D5,
            promotion: None,
        }],
        6779210016254656580 => &[Move {
            from: Square::D7,
            to: Square::D5,
            promotion: None,
        }],
        6272946868676619108 => &[
            Move {
                from: Square::D2,
                to: Square::D3,
                promotion: None,
            },
            Move {
                from: Square::G1,
                to: Square::F3,
                promotion: None,
            },
            Move {
                from: Square::D2,
                to: Square::D4,
                promotion: None,
            },
        ],
        13061586876689830011 => &[Move {
            from: Square::G8,
            to: Square::F6,
            promotion: None,
        }],
        13752862560723339593 => &[
            Move {
                from: Square::B8,
                to: Square::C6,
                promotion: None,
            },
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
        ],
        17376286455381117465 => &[Move {
            from: Square::G8,
            to: Square::F6,
            promotion: None,
        }],
        566014225480610667 => &[
            Move {
                from: Square::B1,
                to: Square::C3,
                promotion: None,
            },
            Move {
                from: Square::G2,
                to: Square::G3,
                promotion: None,
            },
        ],
        11707839858549174801 => &[
            Move {
                from: Square::B1,
                to: Square::C3,
                promotion: None,
            },
            Move {
                from: Square::G2,
                to: Square::G3,
                promotion: None,
            },
        ],
        10568408119406102353 => &[Move {
            from: Square::E5,
            to: Square::D4,
            promotion: None,
        }],
        12645739598405547545 => &[Move {
            from: Square::E5,
            to: Square::D4,
            promotion: None,
        }],
        17473697088031631405 => &[
            Move {
                from: Square::B8,
                to: Square::C6,
                promotion: None,
            },
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
        ],
        4784933698906732847 => &[
            Move {
                from: Square::B8,
                to: Square::C6,
                promotion: None,
            },
            Move {
                from: Square::D7,
                to: Square::D6,
                promotion: None,
            },
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
            Move {
                from: Square::F7,
                to: Square::F5,
                promotion: None,
            },
        ],
        5439807108618834447 => &[
            Move {
                from: Square::G1,
                to: Square::F3,
                promotion: None,
            },
            Move {
                from: Square::D2,
                to: Square::D4,
                promotion: None,
            },
            Move {
                from: Square::F1,
                to: Square::C4,
                promotion: None,
            },
            Move {
                from: Square::B1,
                to: Square::C3,
                promotion: None,
            },
            Move {
                from: Square::F2,
                to: Square::F4,
                promotion: None,
            },
        ],
        17212312594190406517 => &[
            Move {
                from: Square::G1,
                to: Square::F3,
                promotion: None,
            },
            Move {
                from: Square::D2,
                to: Square::D4,
                promotion: None,
            },
            Move {
                from: Square::F1,
                to: Square::C4,
                promotion: None,
            },
            Move {
                from: Square::B1,
                to: Square::C3,
                promotion: None,
            },
            Move {
                from: Square::F2,
                to: Square::F4,
                promotion: None,
            },
        ],
        2151414898005916 => &[Move {
            from: Square::E5,
            to: Square::F4,
            promotion: None,
        }],
        17891702413133369956 => &[Move {
            from: Square::E5,
            to: Square::F4,
            promotion: None,
        }],
        6628815710790071372 => &[Move {
            from: Square::C1,
            to: Square::B2,
            promotion: None,
        }],
        18329140752305026358 => &[Move {
            from: Square::C1,
            to: Square::B2,
            promotion: None,
        }],
        1602837360087047991 => &[Move {
            from: Square::B8,
            to: Square::C6,
            promotion: None,
        }],
        11761998770470964980 => &[Move {
            from: Square::G8,
            to: Square::F6,
            promotion: None,
        }],
        5630523076559939017 => &[Move {
            from: Square::G8,
            to: Square::F6,
            promotion: None,
        }],
        12088735554977452321 => &[Move {
            from: Square::G8,
            to: Square::F6,
            promotion: None,
        }],
        6351383968240436083 => &[Move {
            from: Square::G8,
            to: Square::F6,
            promotion: None,
        }],
        12599590263123327489 => &[
            Move {
                from: Square::C2,
                to: Square::C4,
                promotion: None,
            },
            Move {
                from: Square::G1,
                to: Square::F3,
                promotion: None,
            },
            Move {
                from: Square::G2,
                to: Square::G3,
                promotion: None,
            },
        ],
        6237767684834820089 => &[
            Move {
                from: Square::C2,
                to: Square::C4,
                promotion: None,
            },
            Move {
                from: Square::G1,
                to: Square::F3,
                promotion: None,
            },
            Move {
                from: Square::G2,
                to: Square::G3,
                promotion: None,
            },
        ],
        4139826326305083543 => &[Move {
            from: Square::F8,
            to: Square::G7,
            promotion: None,
        }],
        9255608954820520629 => &[Move {
            from: Square::B1,
            to: Square::C3,
            promotion: None,
        }],
        6459872435047022571 => &[Move {
            from: Square::F8,
            to: Square::G7,
            promotion: None,
        }],
        13024043678399648982 => &[Move {
            from: Square::F8,
            to: Square::G7,
            promotion: None,
        }],
        6728026689479155774 => &[Move {
            from: Square::F8,
            to: Square::G7,
            promotion: None,
        }],
        6073012589594397470 => &[
            Move {
                from: Square::C2,
                to: Square::C4,
                promotion: None,
            },
            Move {
                from: Square::G1,
                to: Square::F3,
                promotion: None,
            },
            Move {
                from: Square::E2,
                to: Square::E4,
                promotion: None,
            },
        ],
        1514021528106737295 => &[Move {
            from: Square::F8,
            to: Square::G7,
            promotion: None,
        }],
        2942773139166932935 => &[Move {
            from: Square::F8,
            to: Square::G7,
            promotion: None,
        }],
        12727905012910776309 => &[Move {
            from: Square::F8,
            to: Square::G7,
            promotion: None,
        }],
        14760114572203936721 => &[Move {
            from: Square::D2,
            to: Square::D4,
            promotion: None,
        }],
        4488675051308718842 => &[
            Move {
                from: Square::E7,
                to: Square::E5,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
            Move {
                from: Square::C7,
                to: Square::C5,
                promotion: None,
            },
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
            Move {
                from: Square::G7,
                to: Square::G6,
                promotion: None,
            },
        ],
        15227333711764943303 => &[
            Move {
                from: Square::E7,
                to: Square::E5,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
            Move {
                from: Square::C7,
                to: Square::C5,
                promotion: None,
            },
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
            Move {
                from: Square::G7,
                to: Square::G6,
                promotion: None,
            },
        ],
        16897454834093243217 => &[
            Move {
                from: Square::D7,
                to: Square::D6,
                promotion: None,
            },
            Move {
                from: Square::F7,
                to: Square::F5,
                promotion: None,
            },
            Move {
                from: Square::D7,
                to: Square::D5,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
            Move {
                from: Square::G7,
                to: Square::G6,
                promotion: None,
            },
        ],
        15540769750351481369 => &[
            Move {
                from: Square::D7,
                to: Square::D6,
                promotion: None,
            },
            Move {
                from: Square::F7,
                to: Square::F5,
                promotion: None,
            },
            Move {
                from: Square::D7,
                to: Square::D5,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
            Move {
                from: Square::G7,
                to: Square::G6,
                promotion: None,
            },
        ],
        8281569285770460062 => &[
            Move {
                from: Square::D7,
                to: Square::D6,
                promotion: None,
            },
            Move {
                from: Square::C7,
                to: Square::C6,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E5,
                promotion: None,
            },
            Move {
                from: Square::D7,
                to: Square::D5,
                promotion: None,
            },
            Move {
                from: Square::B7,
                to: Square::B6,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
            Move {
                from: Square::C7,
                to: Square::C5,
                promotion: None,
            },
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
            Move {
                from: Square::G7,
                to: Square::G6,
                promotion: None,
            },
        ],
        15514465039729785572 => &[
            Move {
                from: Square::D7,
                to: Square::D6,
                promotion: None,
            },
            Move {
                from: Square::C7,
                to: Square::C6,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E5,
                promotion: None,
            },
            Move {
                from: Square::D7,
                to: Square::D5,
                promotion: None,
            },
            Move {
                from: Square::B7,
                to: Square::B6,
                promotion: None,
            },
            Move {
                from: Square::E7,
                to: Square::E6,
                promotion: None,
            },
            Move {
                from: Square::C7,
                to: Square::C5,
                promotion: None,
            },
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
            Move {
                from: Square::G7,
                to: Square::G6,
                promotion: None,
            },
        ],
        7092694534376087005 => &[Move {
            from: Square::E7,
            to: Square::E5,
            promotion: None,
        }],
        4229488410776700207 => &[
            Move {
                from: Square::D7,
                to: Square::D5,
                promotion: None,
            },
            Move {
                from: Square::C7,
                to: Square::C5,
                promotion: None,
            },
            Move {
                from: Square::G8,
                to: Square::F6,
                promotion: None,
            },
        ],
        3723145570203037199 => &[
            Move {
                from: Square::G1,
                to: Square::F3,
                promotion: None,
            },
            Move {
                from: Square::E2,
                to: Square::E4,
                promotion: None,
            },
            Move {
                from: Square::B2,
                to: Square::B3,
                promotion: None,
            },
            Move {
                from: Square::D2,
                to: Square::D4,
                promotion: None,
            },
            Move {
                from: Square::C2,
                to: Square::C4,
                promotion: None,
            },
        ],
        _ => &[],
    }
}
