const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/requireAuth");
const { GetAllSubjects , GetStudentsInSubject , DeleteSubject ,updateSubject } = require("../controllers/AdminDashboardController");

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.UserType === "admin") { 
    next(); 
  } else {
    res.status(403).json({ error: "Access denied. Admins only." });
  }
};

router.use(requireAuth);
router.use(requireAdmin);

router.get("/getallsubjects", GetAllSubjects);

router.get("/getstudentsinsubject", GetStudentsInSubject);

router.delete("/deletesubject", DeleteSubject);

router.put("/updatesubject", updateSubject);

module.exports = router;
