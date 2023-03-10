import { useState } from 'react';
import './App.css';

enum Reaction {
  Like,
  Dislike
};

function App() {
  const [reaction, setReaction] = useState<Reaction | null>(null);

  const handleReaction = (newReaction: Reaction) => {
    switch (reaction) {
      case null:
        setReaction(newReaction);
        return;

      case Reaction.Like:
        if (newReaction === Reaction.Dislike) {
          return;
        }
        setReaction(null);
        return;
      case Reaction.Dislike:
        if (newReaction === Reaction.Like) {
          return;
        }
        setReaction(null);
        return;
    }
  };

  const getButtonStyle = (active: boolean, disabled: boolean) => {
    if (disabled) {
      return { backgroundColor: '#353535' };
    }

    if (active) {
      return { backgroundColor: '#008CBA' };
    }

    return { backgroundColor: '#e7e7e7', color: 'black' };
  }

  return (
    <div className="App">
      <div>
        Do you like Harry Potter?
      </div>
      <div>
        <img width="600" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a9e3440d-0f91-47a7-82c9-7c72df86c43d/dcl0klm-39676ff2-50da-4739-9426-e27b3b59a293.jpg/v1/fill/w_1024,h_577,q_75,strp/harry_potter_and_the_philosopher_s_stone_fanart_01_by_vladislavpantic_dcl0klm-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTc3IiwicGF0aCI6IlwvZlwvYTllMzQ0MGQtMGY5MS00N2E3LTgyYzktN2M3MmRmODZjNDNkXC9kY2wwa2xtLTM5Njc2ZmYyLTUwZGEtNDczOS05NDI2LWUyN2IzYjU5YTI5My5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.FycamM_Eho1WMOChGoAlfzk-g7lEof_DxRIxrktJgwo" />
      </div>
      <div>
        <input
          type="button"
          value="Like"
          disabled={reaction === Reaction.Dislike}
          style={getButtonStyle(reaction === Reaction.Like, reaction === Reaction.Dislike)}
          onClick={() => handleReaction(Reaction.Like)}
        />
        <input
          type="button"
          value="Dislike"
          disabled={reaction === Reaction.Like}
          style={getButtonStyle(reaction === Reaction.Dislike, reaction === Reaction.Like)}
          onClick={() => handleReaction(Reaction.Dislike)}
        />
      </div>
    </div>
  );
}

export default App;
