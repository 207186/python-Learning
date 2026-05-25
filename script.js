// ========================================
// 常量定义
// ========================================

// 本地存储的键名，用于保存笔记数据到浏览器本地存储
const STORAGE_KEY = 'python_notes';

// 分类名称映射表，将分类标识（key）转换为中文显示名称（value）
const categoryNames = {
    all: '全部',           // 全部笔记分类
    learn: '所学所思',      // 学习心得、知识点记录分类
    homework: '作业',      // 作业题目与解答分类
    mistakes: '易错题',     // 易错题目与解决方案分类
    links: '实用链接'      // 实用学习链接分类
};

// 分类图标映射表，为每个分类定义对应的emoji图标
const categoryIcons = {
    learn: '💡',           // 所学所思图标（灯泡表示灵感/知识）
    homework: '📝',        // 作业图标（铅笔表示书写）
    mistakes: '⚠️',        // 易错题图标（警告符号）
    links: '🔗'           // 实用链接图标（链接符号）
};

// ========================================
// 全局变量声明
// ========================================

let notes = [];              // 笔记列表数组，存储所有笔记对象
let currentCategory = 'all'; // 当前选中的分类标识，默认为全部
let currentSearch = '';      // 当前搜索关键词，默认为空字符串
let editingNoteId = null;    // 当前正在编辑的笔记ID，null表示新建笔记
let selectedNote = null;     // 当前选中的笔记对象，用于详情展示和编辑
let uploadedFiles = [];      // 当前上传的文件列表（用于新建/编辑时临时存储）

// ========================================
// 数据加载与保存函数
// ========================================

/**
 * 加载笔记数据
 * 优先从localStorage读取已保存的数据，如果没有则加载初始示例数据
 */
function loadNotes() {
    // 从浏览器localStorage获取保存的笔记数据
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        // 如果存在存储的数据，解析为JSON对象赋值给notes数组
        notes = JSON.parse(stored);
    } else {
        // 如果没有存储数据，加载预设的初始示例笔记
        notes = getInitialNotes();
        // 将初始数据保存到localStorage
        saveNotes();
    }
}

/**
 * 获取初始示例笔记数据
 * 返回一个包含8条示例笔记的数组，涵盖四个分类
 * @returns {Array} 示例笔记数组
 */
function getInitialNotes() {
    return [
        {
            id: '1',                              // 笔记唯一标识（字符串类型）
            title: 'Python变量与数据类型',         // 笔记标题
            content: 'Python中的变量不需要声明类型，直接赋值即可。\n\n主要数据类型：\n- int: 整数\n- float: 浮点数\n- str: 字符串\n- bool: 布尔值\n- list: 列表\n- dict: 字典\n\n注意：字符串可以用单引号或双引号包裹，三引号可以表示多行字符串。',
            category: 'learn',                    // 分类标识（所学所思）
            tags: ['基础', '变量', '数据类型'],     // 标签数组
            createdAt: '2024-01-15T10:30:00',    // 创建时间（ISO格式）
            updatedAt: '2024-01-15T10:30:00'     // 更新时间（ISO格式）
        },
        {
            id: '2',
            title: '作业：计算圆的面积',
            content: '题目：编写一个程序，输入半径，计算并输出圆的面积。\n\n代码：\n```python\nradius = float(input(\"请输入圆的半径：\"))\narea = 3.14159 * radius ** 2\nprint(f\"圆的面积是：{area:.2f}\")\n```\n\n知识点：input函数、类型转换、格式化输出',
            category: 'homework',
            tags: ['作业', '数学计算', '格式化输出'],
            createdAt: '2024-01-16T14:20:00',
            updatedAt: '2024-01-16T14:20:00'
        },
        {
            id: '3',
            title: '常见错误：缩进问题',
            content: '错误示例：\n```python\nif x > 0:\nprint(\"正数\")  # 缺少缩进\n```\n\n正确写法：\n```python\nif x > 0:\n    print(\"正数\")  # 缩进4个空格\n```\n\n注意：Python使用缩进来表示代码块，缩进不一致会导致IndentationError。',
            category: 'mistakes',
            tags: ['错误', '缩进', '语法'],
            createdAt: '2024-01-17T09:15:00',
            updatedAt: '2024-01-17T09:15:00'
        },
        {
            id: '4',
            title: 'Python官方文档',
            content: 'Python官方文档是最权威的学习资源：\n\n- Python官网：https://www.python.org/\n- Python文档：https://docs.python.org/3/\n- Python教程：https://docs.python.org/3/tutorial/\n\n建议将这些链接加入收藏夹，随时查阅。',
            category: 'links',
            tags: ['资源', '官方文档', '学习'],
            createdAt: '2024-01-18T16:45:00',
            updatedAt: '2024-01-18T16:45:00'
        },
        {
            id: '5',
            title: '循环结构：for和while',
            content: 'Python提供两种循环方式：\n\n1. for循环（遍历序列）：\n```python\nfor i in range(10):\n    print(i)\n```\n\n2. while循环（条件循环）：\n```python\ncount = 0\nwhile count < 10:\n    print(count)\n    count += 1\n```\n\nbreak：跳出循环\ncontinue：跳过当前迭代',
            category: 'learn',
            tags: ['循环', 'for', 'while'],
            createdAt: '2024-01-19T11:00:00',
            updatedAt: '2024-01-19T11:00:00'
        },
        {
            id: '6',
            title: '作业：成绩统计程序',
            content: '题目：输入5个学生成绩，计算平均分和最高分。\n\n代码：\n```python\ntotal = 0\nmax_score = 0\nfor i in range(5):\n    score = float(input(f\"请输入第{i+1}个成绩：\"))\n    total += score\n    if score > max_score:\n        max_score = score\navg = total / 5\nprint(f\"平均分：{avg:.2f}\")\nprint(f\"最高分：{max_score}\")\n```',
            category: 'homework',
            tags: ['作业', '循环', '统计'],
            createdAt: '2024-01-20T13:30:00',
            updatedAt: '2024-01-20T13:30:00'
        },
        {
            id: '7',
            title: '常见错误：列表索引越界',
            content: '错误示例：\n```python\nfruits = [\"apple\", \"banana\", \"orange\"]\nprint(fruits[3])  # 索引3不存在\n```\n\n报错：IndexError: list index out of range\n\n解决方法：检查列表长度，确保索引在0到len(list)-1范围内。',
            category: 'mistakes',
            tags: ['错误', '列表', '索引'],
            createdAt: '2024-01-21T10:20:00',
            updatedAt: '2024-01-21T10:20:00'
        },
        {
            id: '8',
            title: '实用Python学习网站',
            content: '推荐几个优质的Python学习资源：\n\n- W3Schools Python教程：https://www.w3schools.com/python/\n- Python练习平台：https://www.codewars.com/\n- LeetCode：https://leetcode.com/\n- GitHub：https://github.com/trending/python\n\n这些网站提供大量练习题目和项目示例。',
            category: 'links',
            tags: ['资源', '学习网站', '练习'],
            createdAt: '2024-01-22T15:00:00',
            updatedAt: '2024-01-22T15:00:00'
        }
    ];
}

/**
 * 保存笔记数据到localStorage
 * 将notes数组转换为JSON字符串后保存
 */
function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// ========================================
// 过滤与搜索函数
// ========================================

/**
 * 搜索过滤笔记
 * 获取搜索框输入的关键词，更新全局搜索变量并触发笔记重新渲染
 */
function filterNotes() {
    // 获取搜索输入框的值并转为小写，实现不区分大小写的搜索
    currentSearch = document.getElementById('searchInput').value.toLowerCase();
    // 重新渲染笔记列表
    renderNotes();
}

/**
 * 按分类过滤笔记
 * 更新当前选中分类，切换按钮样式，并重新渲染笔记列表
 * @param {string} category - 分类标识（all/learn/homework/mistakes/links）
 */
function filterByCategory(category) {
    // 更新全局当前分类变量
    currentCategory = category;
    
    // 移除所有分类按钮的active样式
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    // 为当前选中的分类按钮添加active样式
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // 更新页面上的分类标题显示
    document.getElementById('categoryTitle').textContent = categoryNames[category] + '笔记';
    // 重新渲染笔记列表
    renderNotes();
}

// ========================================
// 渲染函数
// ========================================

/**
 * 渲染笔记列表
 * 根据当前分类和搜索关键词过滤笔记，并生成对应的HTML卡片
 */
function renderNotes() {
    // 获取笔记网格容器DOM元素
    const grid = document.getElementById('notesGrid');
    // 初始化过滤后的笔记列表为全部笔记
    let filteredNotes = notes;
    
    // 如果当前分类不是"全部"，按分类过滤笔记
    if (currentCategory !== 'all') {
        filteredNotes = filteredNotes.filter(note => note.category === currentCategory);
    }
    
    // 如果有搜索关键词，按关键词过滤笔记
    if (currentSearch) {
        filteredNotes = filteredNotes.filter(note => 
            // 搜索标题（转小写）
            note.title.toLowerCase().includes(currentSearch) ||
            // 搜索内容（转小写）
            note.content.toLowerCase().includes(currentSearch) ||
            // 搜索标签（转小写）
            note.tags.some(tag => tag.toLowerCase().includes(currentSearch))
        );
    }
    
    // 更新笔记数量统计显示
    document.getElementById('notesCount').textContent = filteredNotes.length + ' 篇';
    
    // 如果过滤后没有笔记，显示空状态
    if (filteredNotes.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <h3>暂无笔记</h3>
                <p>点击右上角按钮创建第一篇笔记</p>
            </div>
        `;
        return;
    }
    
    // 生成笔记卡片HTML并渲染到页面
    grid.innerHTML = filteredNotes.map(note => `
        <div class="note-card" onclick="showNoteDetail('${note.id}')">
            <!-- 分类标签 -->
            <span class="category-badge category-${note.category}">${categoryIcons[note.category]} ${categoryNames[note.category]}</span>
            <!-- 笔记标题 -->
            <h3>${note.title}</h3>
            <!-- 笔记内容预览（截取前100字符） -->
            <p class="note-preview">${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</p>
            <!-- 元信息区域 -->
            <div class="note-meta">
                <!-- 标签列表（最多显示3个） -->
                <div class="note-tags">
                    ${note.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    ${note.tags.length > 3 ? `<span class="tag">+${note.tags.length - 3}</span>` : ''}
                </div>
                <!-- 更新时间 -->
                <span class="note-date">${formatDate(note.updatedAt)}</span>
            </div>
        </div>
    `).join('');
}

/**
 * 格式化日期显示
 * 根据时间差显示相对时间（刚刚、X分钟前、X小时前、X天前）或具体日期
 * @param {string} dateStr - ISO格式的日期字符串
 * @returns {string} 格式化后的日期显示文本
 */
function formatDate(dateStr) {
    // 将日期字符串转换为Date对象
    const date = new Date(dateStr);
    // 获取当前时间
    const now = new Date();
    // 计算时间差（毫秒）
    const diff = now - date;
    
    // 根据时间差返回不同的显示格式
    if (diff < 60000) return '刚刚';                    // 小于1分钟
    if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'; // 小于1小时
    if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'; // 小于1天
    if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'; // 小于1周
    
    // 超过1周显示具体日期
    return date.toLocaleDateString('zh-CN');
}

// ========================================
// 详情面板函数
// ========================================

/**
 * 显示笔记详情面板
 * 根据笔记ID查找笔记并在右侧面板显示详细内容
 * @param {string} id - 笔记ID
 */
function showNoteDetail(id) {
    // 根据ID查找笔记
    const note = notes.find(n => n.id === id);
    if (!note) return; // 如果未找到笔记，直接返回
    
    // 保存当前选中的笔记
    selectedNote = note;
    
    // 更新详情面板的标题
    document.getElementById('detailTitle').textContent = note.title;
    // 更新分类标签内容和样式
    document.getElementById('detailCategory').textContent = `${categoryIcons[note.category]} ${categoryNames[note.category]}`;
    document.getElementById('detailCategory').className = `category-badge category-${note.category}`;
    // 更新日期显示
    document.getElementById('detailDate').textContent = '更新于 ' + formatDate(note.updatedAt);
    
    // 生成标签HTML并更新
    const tagsHtml = note.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    document.getElementById('detailTags').innerHTML = tagsHtml;
    
    // 更新笔记正文内容
    document.getElementById('detailBody').textContent = note.content;
    
    // 渲染附件列表
    renderDetailFiles(note.files || []);
    
    // 显示详情面板
    document.getElementById('detailPanel').style.display = 'flex';
}

/**
 * 在详情面板中渲染附件列表
 * @param {Array} files - 文件数组
 */
function renderDetailFiles(files) {
    const filesContainer = document.getElementById('detailFiles');
    
    if (!files || files.length === 0) {
        filesContainer.innerHTML = '';
        filesContainer.style.display = 'none';
        return;
    }
    
    filesContainer.style.display = 'block';
    filesContainer.innerHTML = `
        <div class="detail-section">
            <h4>📎 附件 (${files.length})</h4>
            <div class="detail-files">
                ${files.map(file => `
                    <div class="detail-file-item" onclick="previewFile('${file.id}')">
                        <span class="file-icon">${getFileIcon(file.type)}</span>
                        <span class="file-name">${file.name}</span>
                        <span class="file-size">${file.size}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * 预览文件
 * @param {string} fileId - 文件ID
 */
function previewFile(fileId) {
    const note = selectedNote;
    if (!note || !note.files) return;
    
    const file = note.files.find(f => f.id === fileId);
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
        // 图片文件显示预览
        const modal = document.createElement('div');
        modal.className = 'preview-modal';
        modal.innerHTML = `
            <div class="preview-overlay" onclick="closePreview()"></div>
            <div class="preview-content">
                <button class="preview-close" onclick="closePreview()">✕</button>
                <img src="${file.data}" alt="${file.name}" />
            </div>
        `;
        document.body.appendChild(modal);
        modal.classList.add('show');
    } else {
        // 非图片文件提供下载链接
        const link = document.createElement('a');
        link.href = file.data;
        link.download = file.name;
        link.click();
    }
}

/**
 * 关闭文件预览模态框
 */
function closePreview() {
    const modal = document.querySelector('.preview-modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * 关闭笔记详情面板
 * 隐藏面板并重置选中笔记变量
 */
function closeDetail() {
    // 隐藏详情面板
    document.getElementById('detailPanel').style.display = 'none';
    // 重置选中笔记变量
    selectedNote = null;
}

// ========================================
// 模态框（新建/编辑）函数
// ========================================

/**
 * 显示新建笔记模态框
 * 重置表单为初始状态并显示模态框
 */
function showAddNote() {
    // 重置编辑ID为null（表示新建）
    editingNoteId = null;
    // 更新模态框标题
    document.getElementById('modalTitle').textContent = '新建笔记';
    // 重置表单字段
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteCategory').value = 'learn';
    document.getElementById('noteTags').value = '';
    document.getElementById('noteContent').value = '';
    // 重置上传文件列表
    uploadedFiles = [];
    document.getElementById('fileList').innerHTML = '';
    // 显示模态框和遮罩层
    document.getElementById('modal').classList.add('show');
    document.getElementById('modalOverlay').classList.add('show');
}

/**
 * 显示编辑笔记模态框
 * 将选中笔记的内容填充到表单中
 */
function editNote() {
    // 如果没有选中的笔记，直接返回
    if (!selectedNote) return;
    
    // 设置当前编辑的笔记ID
    editingNoteId = selectedNote.id;
    // 更新模态框标题
    document.getElementById('modalTitle').textContent = '编辑笔记';
    // 将选中笔记的内容填充到表单
    document.getElementById('noteTitle').value = selectedNote.title;
    document.getElementById('noteCategory').value = selectedNote.category;
    document.getElementById('noteTags').value = selectedNote.tags.join(', ');
    document.getElementById('noteContent').value = selectedNote.content;
    // 加载已有的文件列表
    uploadedFiles = selectedNote.files || [];
    renderFileList();
    // 显示模态框和遮罩层
    document.getElementById('modal').classList.add('show');
    document.getElementById('modalOverlay').classList.add('show');
}

/**
 * 关闭模态框
 * 隐藏模态框和遮罩层，重置编辑ID
 */
function closeModal() {
    // 隐藏模态框和遮罩层
    document.getElementById('modal').classList.remove('show');
    document.getElementById('modalOverlay').classList.remove('show');
    // 重置编辑ID
    editingNoteId = null;
    // 清空上传文件列表
    uploadedFiles = [];
}

/**
 * 处理文件上传
 * 将文件转换为Base64格式并添加到上传列表
 * @param {Event} event - 文件选择事件
 */
function handleFileUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
        // 检查文件大小（限制5MB）
        if (file.size > 5 * 1024 * 1024) {
            alert('文件大小不能超过5MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileData = {
                id: Date.now().toString() + Math.random(),
                name: file.name,
                type: file.type,
                size: formatFileSize(file.size),
                data: e.target.result // Base64编码的文件数据
            };
            uploadedFiles.push(fileData);
            renderFileList();
        };
        
        // 根据文件类型选择读取方式
        if (file.type.startsWith('image/')) {
            reader.readAsDataURL(file);
        } else {
            reader.readAsDataURL(file);
        }
    });
    
    // 重置文件输入
    event.target.value = '';
}

/**
 * 格式化文件大小
 * @param {number} bytes - 文件大小（字节）
 * @returns {string} 格式化后的文件大小字符串
 */
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * 渲染已上传文件列表
 */
function renderFileList() {
    const fileList = document.getElementById('fileList');
    
    if (uploadedFiles.length === 0) {
        fileList.innerHTML = '';
        return;
    }
    
    fileList.innerHTML = uploadedFiles.map(file => `
        <div class="file-item">
            <span class="file-icon">${getFileIcon(file.type)}</span>
            <div class="file-info">
                <span class="file-name">${file.name}</span>
                <span class="file-size">${file.size}</span>
            </div>
            <button class="file-remove" onclick="removeFile('${file.id}')">✕</button>
        </div>
    `).join('');
}

/**
 * 获取文件图标
 * @param {string} type - 文件类型
 * @returns {string} 对应的emoji图标
 */
function getFileIcon(type) {
    if (type.startsWith('image/')) return '🖼️';
    if (type.includes('pdf')) return '📕';
    if (type.includes('word') || type.includes('doc')) return '📘';
    if (type.includes('text')) return '📄';
    return '📎';
}

/**
 * 移除已上传的文件
 * @param {string} fileId - 文件ID
 */
function removeFile(fileId) {
    uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
    renderFileList();
}

/**
 * 保存笔记
 * 根据是新建还是编辑，执行相应的保存逻辑
 * @param {Event} event - 表单提交事件对象
 */
function saveNote(event) {
    // 阻止表单默认提交行为
    event.preventDefault();
    
    // 获取表单字段值
    const title = document.getElementById('noteTitle').value;
    const category = document.getElementById('noteCategory').value;
    const tagsInput = document.getElementById('noteTags').value;
    const content = document.getElementById('noteContent').value;
    
    // 将标签输入字符串转换为数组（逗号分隔，去除空格和空值）
    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t);
    
    // 获取当前时间（ISO格式）
    const now = new Date().toISOString();
    
    if (editingNoteId) {
        // 如果是编辑模式，找到对应笔记并更新
        const index = notes.findIndex(n => n.id === editingNoteId);
        if (index !== -1) {
            notes[index] = {
                ...notes[index],  // 保留原有属性
                title,            // 更新标题
                category,         // 更新分类
                tags,             // 更新标签
                content,          // 更新内容
                files: uploadedFiles,  // 更新文件列表
                updatedAt: now    // 更新时间
            };
        }
    } else {
        // 如果是新建模式，创建新笔记对象
        const newNote = {
            id: Date.now().toString(),  // 使用时间戳作为ID
            title,                      // 标题
            category,                   // 分类
            tags,                       // 标签
            content,                    // 内容
            files: uploadedFiles,       // 文件列表
            createdAt: now,             // 创建时间
            updatedAt: now              // 更新时间
        };
        // 将新笔记添加到数组开头
        notes.unshift(newNote);
    }
    
    // 保存到localStorage
    saveNotes();
    // 重新渲染笔记列表
    renderNotes();
    // 关闭模态框
    closeModal();
    
    // 如果是新建笔记，自动切换到对应分类视图
    if (!editingNoteId) {
        filterByCategory(category);
    }
}

/**
 * 删除笔记
 * 删除当前选中的笔记，并更新UI
 */
function deleteNote() {
    // 如果没有选中的笔记，直接返回
    if (!selectedNote) return;
    
    // 弹出确认对话框
    if (!confirm('确定要删除这篇笔记吗？')) return;
    
    // 从笔记数组中过滤掉当前选中的笔记
    notes = notes.filter(n => n.id !== selectedNote.id);
    // 保存到localStorage
    saveNotes();
    // 关闭详情面板
    closeDetail();
    // 重新渲染笔记列表
    renderNotes();
}

// ========================================
// 页面初始化
// ========================================

/**
 * 页面加载完成后执行初始化
 * 加载笔记数据并渲染初始列表
 */
document.addEventListener('DOMContentLoaded', () => {
    // 加载笔记数据
    loadNotes();
    // 渲染笔记列表
    renderNotes();
});
