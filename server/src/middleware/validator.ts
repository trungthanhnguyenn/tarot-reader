import { Request, Response, NextFunction } from 'express';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const { name, dob } = req.body;

  if (!name || !dob) {
    return res.status(400).json({ 
      success: false,
      error: 'Vui lòng nhập đầy đủ Tên và Ngày sinh.' 
    });
  }

  // Name validation
  if (typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ 
      success: false,
      error: 'Tên phải là một chuỗi có ít nhất 2 ký tự.' 
    });
  }
  if (name.length > 50) {
    return res.status(400).json({ 
      success: false,
      error: 'Tên không được vượt quá 50 ký tự.' 
    });
  }
  if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(name.trim())) {
    return res.status(400).json({ 
      success: false,
      error: 'Tên chỉ được chứa chữ cái và khoảng trắng.' 
    });
  }

  // DOB validation
  if (typeof dob !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    return res.status(400).json({ 
      success: false,
      error: 'Ngày sinh phải có định dạng YYYY-MM-DD.' 
    });
  }

  const dobDate = new Date(dob);
  const today = new Date();

  if (dobDate > today) {
    return res.status(400).json({ 
      success: false,
      error: 'Ngày sinh không thể là một ngày trong tương lai.' 
    });
  }
  
  const age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  const dayDiff = today.getDate() - dobDate.getDate();
  let actualAge = age;
  
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    actualAge--;
  }

  if (actualAge < 13 || actualAge > 100) {
    return res.status(400).json({ 
      success: false,
      error: 'Tuổi phải trong khoảng từ 13 đến 100.' 
    });
  }

  next();
  return;
};
