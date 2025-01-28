const express = require("express")
const router = express.Router();
const {requireAuth} = require("../middleware/requireAuth")
const {DocCreateActivity, DocRemoveActivity, DocCreateGroupActivity, DocDeleteGroupActivity, DocAddParticipant, DocDeleteParticipant, DocAllParticipants, DocGroupSize, DocGroupaActivity, DocAllGroups, DocAllActivities, DocGroupsOfActivity, DocAllLocations, DocDeleteGroupActivityLeader, test} = require("../controllers/ActivityController")

router.use(requireAuth)

router.post("/test" , test)


router.post("/createactivity", DocCreateActivity)
router.delete("/deleteactivity", DocRemoveActivity)


router.post("/creategroupactivity", DocCreateGroupActivity)
router.delete("/deletegroupactivity", DocDeleteGroupActivity)

router.post("/addparticipant", DocAddParticipant)
router.delete("/deleteparticipant", DocDeleteParticipant)

router.post("/allparticipants", DocAllParticipants)


router.post("/groupsize", DocGroupSize)

router.post("/groupactivity", DocGroupaActivity)


router.post("/allgroups", DocAllGroups)


router.post("/allactivities", DocAllActivities)

router.post("/alllocations", DocAllLocations)

router.post("/groupsofactivity", DocGroupsOfActivity)


router.post("/deletegroupleader", DocDeleteGroupActivityLeader)




























module.exports = router