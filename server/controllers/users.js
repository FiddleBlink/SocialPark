import User from "../models/User.js";

export const getUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

export const getUserFriends = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);

		const friends = await Promise.all(
			user.friends.map((id) => User.findById(id))
		);

		const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
			return { _id, firstName, lastName, occupation, location, picturePath };
		})

		res.status(200).json(formattedFriends);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

export const addremoveFriend = async (req, res) => {
	try {
		const { id, friendID } = req.params;
		const user = await User.findById(id);
		const friend = await User.findById(friendID);

			
		if (user.friends.includes(friendID)) {
			if (id === friendID) { 
				user.friends = user.friends.filter((id) => id !== friendID);
			} else {
				user.friends = user.friends.filter((id) => id !== friendID);
				friend.friends = friend.friends.filter((id) => id !== id);
			}
		} else {
			if (id === friendID) { 
				user.friends.push(friendID);
			} else {		
				user.friends.push(friendID);
				friend.friends.push(id);
			}
		};

		console.log(user.friends);
		console.log(friend.friends);

		await user.save();
		await friend.save();

		console.log("Saved");
		
		const friends = await Promise.all(user.friends.map((id) => User.findById(id)));

		console.log(friends);

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
		);
		
		res.status(200).json(formattedFriends);

	} catch (error) {
		res.status(500).json({ error: "error.message" });
	}
}