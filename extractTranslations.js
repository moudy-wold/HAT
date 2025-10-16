import fs from "fs";
import path from "path";

// مجلد المشروع الذي يحتوي على الأكواد
const projectDir = "./app"; // غيّر المسار حسب مشروعك
const langFilePath = "./i18n/locales/ar/common.json"; // ملف اللغة العربية

// قراءة ملف اللغة العربية الحالي
let arData = {};
if (fs.existsSync(langFilePath)) {
  arData = JSON.parse(fs.readFileSync(langFilePath, "utf8"));
}

// دالة لجمع كل الملفات
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      arrayOfFiles.push(filePath);
    }
  });
  return arrayOfFiles;
}

// البحث عن كل t("string") أو t('string')
function extractKeysFromFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const regex = /t\(\s*["'`]([^"'`]+)["'`]\s*\)/g;
  const matches = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

// جمع كل المفاتيح
const files = getAllFiles(projectDir);
const allKeys = new Set();

files.forEach((file) => {
  const keys = extractKeysFromFile(file);
  keys.forEach((k) => allKeys.add(k));
});

// إضافة المفاتيح الجديدة
let addedCount = 0;
for (const key of allKeys) {
  if (!arData[key]) {
    arData[key] = key; // يضع النص نفسه مؤقتًا
    addedCount++;
  }
}

// حفظ الملف
fs.writeFileSync(langFilePath, JSON.stringify(arData, null, 2), "utf8");

console.log(`✅ تم تحديث ${langFilePath}`);
console.log(`🆕 تمت إضافة ${addedCount} مفاتيح جديدة.`);
