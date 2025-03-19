import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import initialFriends from "./App";

function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendsArray, setFriendsArray] = useState([
    {
      id: 118836,
      name: "Clark",
      image: "https://i.pravatar.cc/48?u=118836",
      balance: -7,
    },
    {
      id: 118837,
      name: "Frank",
      image:
        "https://i.etsystatic.com/10768173/r/il/0efe3b/3294958895/il_570xN.3294958895_hj8h.jpg",
      balance: 0,
    },
  ]);
  const [selectedFriend, setSelectedFriend] = useState("Tst");

  //Handles the execution of sowing or hiding the component to add a new friend to the array
  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  //Handles updating the state of selectedFriend, passed to FriendsList component
  function handleSelectedFriend(friend) {
    setSelectedFriend(friend);
  }

  //Handles adding a new friend element to the friendsArray with info from the FormAddFriend Component
  function handleAddFriend({ name, image }) {
    let newName = name;
    let newImage = image;
    let newFriend = {
      name: newName,
      image: newImage,
      id: friendsArray.length + 1,
      balance: 0,
    };
    setFriendsArray((friends) => [...friends, newFriend]);
  }

  return (
    <>
      <div className="app">
        <div className="sidebar">
          <FriendList
            friendsArray={friendsArray}
            onFriendSelect={handleSelectedFriend}
          />
          {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
          <Button onClick={handleShowAddFriend}>
            {showAddFriend ? "Close" : "Add Friend"}
          </Button>
        </div>
        <FormSplitBill
          chosenFriend={selectedFriend}
          onSplitBill={setFriendsArray}
        />
      </div>
    </>
  );
}

//FriendList component that creates a Friend component for each friend in the friendsArray
function FriendList({ friendsArray, onFriendSelect }) {
  const friends = friendsArray;

  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onFriendSelect={onFriendSelect}
        />
      ))}
    </ul>
  );
}

//Friend component
function Friend({ friend, onFriendSelect }) {
  let tempFriend = friend;
  console.log(tempFriend);
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are square</p>}
      <Button onClick={() => onFriendSelect(tempFriend)}>Select</Button>
    </li>
  );
}

//FormAddFriend component
function FormAddFriend({ onAddFriend }) {
  const [friendName, setFriendName] = useState("");
  const [imgUrl, setImgURl] = useState("");

  //Handles form submit, updates state for friendName,imgURl and calls handleAddFriend by onAddFriend
  function handleSubmit(event) {
    event.preventDefault();
    onAddFriend({ name: friendName, image: imgUrl });
    setFriendName("");
    setImgURl("");
  }

  //Updates friendName state
  function handleFriendName(props) {
    const name = props.target.value;
    setFriendName(name);
    console.log(name);
  }

  //Updates imgUrl state
  function handleImgUrl(props) {
    const image = props.target.value;
    setImgURl(image);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend Name</label>
      <input
        type="text"
        value={friendName}
        onChange={(e) => handleFriendName(e)}
      />
      <label>Image Url</label>
      <input type="text" value={imgUrl} onChange={(e) => handleImgUrl(e)} />
      <Button>Add</Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={(e) => onClick(e)}>
      {children}
    </button>
  );
}

//FormSplitBill Component
function FormSplitBill({ chosenFriend, onSplitBill }) {
  const [billValue, setBillValue] = useState(0);
  const [userAmount, setUserAmount] = useState(0);
  const [selectBillPayer, setSelectBillPayer] = useState("user");

  //Derives the friendAmount from billValue and userAmount state;
  let friendAmount = billValue - userAmount;

  //Handles submit of form, determines logic for the new balance of the chosenFriend, updates state of billvalue/userAmount/selectBillPayer and applies new balance to chosenFriend in the friendsArray by using onSplitBill/setFriendsArray
  function handleSubmit(event) {
    event.preventDefault();
    let newBalance = 0;
    if (selectBillPayer === "user") {
      newBalance = chosenFriend.balance + friendAmount;
    }
    if (selectBillPayer !== "user") {
      newBalance = chosenFriend.balance - friendAmount;
    }
    onSplitBill((array) =>
      array.map((element) =>
        element.id === chosenFriend.id
          ? { ...element, balance: newBalance }
          : element
      )
    );
    setBillValue(0);
    setUserAmount(0);
    setSelectBillPayer("user");
  }

  //Updates userAmount state
  function handleUserAmount(event) {
    let value = Number(event.target.value);
    setUserAmount(value);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {chosenFriend ? chosenFriend.name : "Someone"}</h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={billValue}
        onChange={(e) => setBillValue(Number(e.target.value))}
      />

      <label>Your amount</label>
      <input
        type="text"
        value={userAmount}
        onChange={(e) => handleUserAmount(e)}
      />

      <label>
        {chosenFriend ? chosenFriend.name : "Other"} person's amount
      </label>
      <input type="text" disabled value={friendAmount} />

      <label>Who is paying the bill?</label>
      <select
        value={selectBillPayer}
        onChange={(e) => setSelectBillPayer(e.target.value)}
      >
        <option value="user">You</option>
        <option value={chosenFriend.name}> {chosenFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}

export default App;
