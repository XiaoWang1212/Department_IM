import requests
from bs4 import BeautifulSoup
import os
import json
import time

def scrape_teachers():
    url = "https://im.mgt.ncu.edu.tw/teacher"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    teachers = []
    try:
        response = requests.get(url, headers=headers)
        response.encoding = 'utf-8'
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 找到所有教師卡片
        teacher_cards = soup.select('.teacher-table')
        
        for card in teacher_cards:
            try:
                # 基本資訊
                name = card.select_one('.an').text.strip().split()[0]
                position = card.select_one('.an').text.strip().split()[1]
                
                # 處理職稱（如果有）
                title_text = card.select_one('.an').text.strip()
                title = title_text.split('兼')[1].strip() if '兼' in title_text else None
                
                # 照片
                photo = card.select_one('.t_img')['src']
                photo_name = photo.split('/')[-1]
                
                # 其他資訊
                info_rows = card.select('.infor_tr')
                education = ""
                expertise = ""
                awards = ""
                email = ""
                office = ""
                extension = ""
                website = ""
                
                for row in info_rows:
                    title_cell = row.select_one('.ba_title').text.strip()
                    content = row.select_one('.ba_comment').text.strip()
                    
                    if '學歷' in title_cell:
                        education = content
                    elif '專長' in title_cell:
                        expertise = content
                    elif '獎項' in title_cell:
                        awards = content
                    elif 'E-mail' in title_cell:
                        email = content.strip()
                    elif '辦公室' in title_cell:
                        office = content
                    elif '分機' in title_cell:
                        extension = content
                    elif '個人網頁' in title_cell:
                        website = row.select_one('a')['href'] if row.select_one('a') else ""

                teacher_data = {
                    "name": name,
                    "position": position,
                    "title": title,
                    "photo": f"./assets/photo/{photo_name}",
                    "education": education,
                    "expertise": expertise,
                    "awards": awards,
                    "email": email,
                    "office": office,
                    "extension": extension,
                    "website": website
                }
                
                teachers.append(teacher_data)
                time.sleep(1)  # 避免請求過於頻繁
                
            except Exception as e:
                print(f"處理教師資料時發生錯誤: {e}")
                continue
                
    except Exception as e:
        print(f"爬取過程發生錯誤: {e}")
        
    return teachers

def save_to_js(teachers):
    # 使用原始字串（raw string）來避免 Unicode 轉義問題
    js_content = fr"""// filepath: {os.path.join(os.getcwd(), 'assets', 'js', 'data.js')}
const teacherData = {json.dumps(teachers, ensure_ascii=False, indent=2)};
"""
    
    with open('assets/js/data.js', 'w', encoding='utf-8') as f:
        f.write(js_content)

def download_photos(teachers):
    for teacher in teachers:
        try:
            photo_url = teacher['photo'].replace('./assets/photo/', 'https://im.mgt.ncu.edu.tw/img/teacher/')
            response = requests.get(photo_url)
            
            if response.status_code == 200:
                photo_name = photo_url.split('/')[-1]
                with open(f'assets/photo/{photo_name}', 'wb') as f:
                    f.write(response.content)
                print(f"已下載照片: {photo_name}")
                time.sleep(1)
        except Exception as e:
            print(f"下載照片時發生錯誤: {e}")

if __name__ == "__main__":
    # 建立 photo 資料夾（如果不存在）
    import os
    os.makedirs('assets/photo', exist_ok=True)
    
    # 爬取教師資料
    teachers = scrape_teachers()
    
    # 下載教師照片
    download_photos(teachers)
    
    # 儲存資料到 JS 檔案
    save_to_js(teachers)
    
    print(f"完成！共爬取 {len(teachers)} 位教師的資料")