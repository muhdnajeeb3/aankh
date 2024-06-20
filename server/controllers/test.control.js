const Test = require("../models/test");
const User = require("../models/user");
const shortid = require("shortid");

const createTest = (req, res) => {
    const { email, test_name, test_link_by_user, start_time, end_time, no_of_candidates_appear, total_threshold_warnings } = req.body;

    // Check if the test_link_by_user already exists
    Test.findOne({ test_link_by_user: test_link_by_user }, (err, existingTest) => {
        if (err) {
            // Handle any server errors while querying the database
            return res.status(500).json({ msg: "Server error while checking for existing test link", error: err });
        }
        if (existingTest) {
            // If the test link already exists, send a specific response
            return res.status(400).json({ msg: "Test link already exists" });
        }

        // If test link does not exist, proceed to create a new test
        const testCode = shortid.generate() + "-" + shortid.generate();
        const test = new Test({
            userId: req.user.id,
            email: email,
            test_name: test_name,
            test_link_by_user: test_link_by_user,
            test_code: testCode,
            start_time: start_time,
            end_time: end_time,
            no_of_candidates_appear: no_of_candidates_appear,
            total_threshold_warnings: total_threshold_warnings
        });

        test.save((error, data) => {
            if (error) {
                // Handle any errors while saving the new test
                return res.status(400).json({ msg: "Something happened while creating new test", error });
            }
            if (data) {
                // If the test is successfully created, send a success response
                return res.status(201).json({ msg: "Successfully created new Test on platform", test_code: testCode });
            }
        });
    });
};


const userCreatedTests = (req, res) => {
  const userId = req.user.id;
  if (userId) {
    Test.find({ userId: userId }).exec((error, _allTests) => {
      if (error)
        return res
          .status(400)
          .json({
            msg: "Something went wrong while fetching user tests",
            error,
          });
      if (_allTests) return res.status(200).json({ _allTests });
    });
  } else {
    return res.status(400).json({
      msg: {
        one: "check user id, something wrong with it",
        two: "can't pass empty userId",
      },
    });
  }
};

const testRegister = async (req, res) => {
  const { test_code } = req.params;
  const userId = req.user.id;
  if (userId) {
    const updateData = await User.findOneAndUpdate(
      { _id: userId },
      {
        test_code: test_code,
      }
    );
    // res.status(200).json({ updateData });
    res.status(200).json({ msg: "Now you are register" });
  }
};

const testAdminData = (req, res) => {
  const { test_code } = req.params;
  if (test_code) {
    User.find({ test_code: test_code }).exec((error, candidates) => {
      if (error)
        return res
          .status(400)
          .json({
            msg: "Something went wrong while fetching candidates-status",
          });
      if (candidates) return res.status(200).json({ candidates });
    });
  }
};

const increasePersonDetected = async (req, res) => {
  const userId = req.user.id;
  if (userId) {
    const updateData = await User.findOneAndUpdate(
      { _id: userId },
      {
        $inc: { person_detected: 1 },
      }
    );
    res.status(200).json({ msg: "warning of person detected" });
  }
};

// Handler to get warnings for all users
const getAllWarnings = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "studentID person_detected voice_detected face_covering other_warning_fields"
    );
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all warnings:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const increaseVoiceDetected = async (req, res) => {
  const userId = req.user.id;
  if (userId) {
    const updateData = await User.findOneAndUpdate(
      { _id: userId },
      {
        $inc: { voice_detected: 1 },
      }
    );
    res.status(200).json({ msg: "warning of voice detected" });
  }
};

const increaseFaceCovering = async (req, res) => {
  const userId = req.user.id;
  if (userId) {
    const updateData = await User.findOneAndUpdate(
      { _id: userId },
      {
        $inc: { face_covered: 1 },
      }
    );
    res.status(200).json({ msg: "warning for face covering" });
  }
};

const totalWarnings = (req, res) => {
  const userId = req.user.id;
  if (userId) {
    User.findOne({ _id: userId }).exec((error, data) => {
      if (data) {
        let total_warnings =
          data.person_detected + data.voice_detected + data.face_covered;
        return res.status(200).json({ totalWarnings: total_warnings });
      }
    });
  } else {
    return res.status(200).json({ msg: "check user-id" });
  }
};

// const terminateExam = async (req, res) => {
//     const userId = req.user?.id;
//     if (userId) {
//         const updateData = await User.findOneAndUpdate({ _id: userId }, {
//             status: "block"
//         });
//         // res.status(200).json({ updateData });
//         res.status(200).json({ msg: "candidate has been blocked" })
//     }
// }
const terminateExam = async (req, res) => {
  const userId = req.params.userId;
  if (userId) {
    try {
      await User.findOneAndUpdate({ _id: userId }, { status: "block" });
      res.status(200).json({ msg: "Candidate has been blocked" });
    } catch (error) {
      res.status(500).json({ msg: "Error blocking candidate", error });
    }
  } else {
    res.status(400).json({ msg: "Invalid user ID" });
  }
};
const getTerminatedUsers = async (req, res) => {
  try {
    const terminatedUsers = await User.find({ status: "block" });
    res.status(200).json(terminatedUsers);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching terminated users", error });
  }
};

// const allowInExam = async (req, res) => {
//     const userId = req.user.id;
//     if (userId) {
//         const updateData = await User.findOneAndUpdate({ _id: userId }, {
//             status: "safe"
//         });
//         // res.status(200).json({ updateData });
//         res.status(200).json({ msg: "candidate is now allowed to give exam" })
//     }
// }
const allowInExam = async (req, res) => {
  const userId = req.params.userId;
  if (userId) {
    try {
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Check if the user is terminated
      if (user.status === "block") {
        // Remove user from the terminated list
        await User.findOneAndUpdate({ _id: userId }, { status: "safe" });

        // Add user to the allowed users list
        await User.findOneAndUpdate(
          { _id: userId },
          { $addToSet: { allowedUsers: userId } }
        );

        res.status(200).json({ msg: "Candidate is now allowed to give exam" });
      } else {
        res.status(400).json({ msg: "User is not terminated" });
      }
    } catch (error) {
      res.status(500).json({ msg: "Error allowing candidate", error });
    }
  } else {
    res.status(400).json({ msg: "Invalid user ID" });
  }
};

const getAllowedUsers = async (req, res) => {
  try {
    const allowedUsers = await User.find({ status: "safe" });
    res.status(200).json(allowedUsers);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch allowed users", error });
  }
};

module.exports = {
  createTest,
  userCreatedTests,
  testRegister,
  testAdminData,
  increasePersonDetected,
  increaseVoiceDetected,
  increaseFaceCovering,
  increasePersonDetected,
  increaseVoiceDetected,
  increaseFaceCovering,
  totalWarnings,
  terminateExam,
  allowInExam,
  getAllWarnings,
  getTerminatedUsers,
  getAllowedUsers,
};
