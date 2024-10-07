const MediaQueries = {
   hover: `( pointer: fine ) and ( hover : hover )`,
   touch: `(pointer: coarse) and (hover: none)`,
   vertical: `( orientation: portrait ), (max-width: 940px)`,

   medium: `( max-width: 1080px )`,
   mobile: `( max-width: 768px )`,
   tiny: `( max-width: 380px )`,

   gridTwoCols: `( max-width: 1180px )`, // same as medium atm
   gridOneCol: `( max-width: 768px )`, // same as mobile atm
};

export { MediaQueries };
