import Department from "../models/Department.js";

const getDepartments =async (req,res)=>{
    try{
        const departments=await Department.find()
        return res.status(200).json({success:true,departments})
    }catch(error){
        return res.status(500).json({success:false,error:"get department server error"})
    }
}
const addDepartment =async (req,res) =>{
    try{
        const {dep_name,description}=req.body;
        const newDep=new Department({
            dep_name,
            description
        });
        await newDep.save()
        return res.status(200).json({success:true,department:newDep})

    }catch(error){
        return res.status(500).json({success:false,error:"add department server error"})
    }
}
const editDepartment =async (req,res)=>{
     try {
    const { id } = req.params;
    const { dep_name, description } = req.body;

    const updatedDep = await Department.findByIdAndUpdate(
      id,
      { dep_name, description },
      { new: true }
    );

    if (!updatedDep) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }

    return res.status(200).json({ success: true, department: updatedDep });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Edit department server error" });
  }
}
const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }

    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Invalid department ID or server error" });
  }
};
const updateDepartment =async (req,res)=>{
    try{
        const {id} =req.params;
        const {dep_name,description}=req.body;
        const updateDep=await Department.findByIdAndUpdate({_id:id},{
            dep_name,
            description
        })
    return res.status(200).json({ success: true,updateDep });
  } catch (error) {
    return res.status(500).json({ success: false, error: "edit department server error" });
  }

}
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({ success: false, error: "Invalid department ID" });
    }

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }

    await department.deleteOne(); // ✅ This triggers pre("deleteOne") middleware

    return res.status(200).json({ success: true, message: "Department and related data deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ success: false, error: "Server error while deleting department" });
  }
};



export {
  addDepartment,
  getDepartments,
  editDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
};