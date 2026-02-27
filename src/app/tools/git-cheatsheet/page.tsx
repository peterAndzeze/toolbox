"use client";

import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { CheatSheet, CheatItem } from "@/components/CheatSheet";

const categories = ["配置", "创建仓库", "基本操作", "分支管理", "远程操作", "撤销与回退", "暂存", "标签", "查看信息", "高级操作"];

const items: CheatItem[] = [
  // 配置
  { category: "配置", title: "设置用户名", description: "设置全局 Git 用户名", code: "git config --global user.name \"Your Name\"" },
  { category: "配置", title: "设置邮箱", description: "设置全局 Git 邮箱", code: "git config --global user.email \"you@example.com\"" },
  { category: "配置", title: "查看配置", description: "查看当前 Git 配置", code: "git config --list" },
  { category: "配置", title: "设置默认编辑器", description: "设置 commit message 编辑器", code: "git config --global core.editor \"code --wait\"" },

  // 创建仓库
  { category: "创建仓库", title: "初始化仓库", description: "在当前目录创建 Git 仓库", code: "git init" },
  { category: "创建仓库", title: "克隆远程仓库", description: "克隆一个远程仓库到本地", code: "git clone https://github.com/user/repo.git" },
  { category: "创建仓库", title: "克隆指定分支", description: "克隆并切换到指定分支", code: "git clone -b develop https://github.com/user/repo.git" },

  // 基本操作
  { category: "基本操作", title: "查看状态", description: "查看工作区和暂存区状态", code: "git status" },
  { category: "基本操作", title: "添加文件", description: "将文件添加到暂存区", code: "# 添加单个文件\ngit add file.txt\n# 添加所有修改\ngit add .\n# 添加所有 .js 文件\ngit add *.js" },
  { category: "基本操作", title: "提交更改", description: "将暂存区内容提交到仓库", code: "git commit -m \"feat: add new feature\"" },
  { category: "基本操作", title: "添加并提交", description: "跳过 add，直接提交已跟踪文件的修改", code: "git commit -am \"fix: quick fix\"" },
  { category: "基本操作", title: "查看差异", description: "查看文件修改内容", code: "# 工作区与暂存区的差异\ngit diff\n# 暂存区与上次提交的差异\ngit diff --staged\n# 两个分支的差异\ngit diff main..develop" },

  // 分支管理
  { category: "分支管理", title: "查看分支", description: "查看本地和远程分支", code: "# 本地分支\ngit branch\n# 所有分支（含远程）\ngit branch -a\n# 查看分支详情\ngit branch -v" },
  { category: "分支管理", title: "创建分支", description: "创建新分支", code: "git branch feature/login" },
  { category: "分支管理", title: "切换分支", description: "切换到指定分支", code: "git checkout develop\n# 或（推荐）\ngit switch develop" },
  { category: "分支管理", title: "创建并切换", description: "创建新分支并立即切换", code: "git checkout -b feature/login\n# 或\ngit switch -c feature/login" },
  { category: "分支管理", title: "合并分支", description: "将指定分支合并到当前分支", code: "# 先切到目标分支\ngit switch main\n# 合并 feature 分支\ngit merge feature/login" },
  { category: "分支管理", title: "删除分支", description: "删除已合并的分支", code: "# 删除本地分支\ngit branch -d feature/login\n# 强制删除\ngit branch -D feature/login\n# 删除远程分支\ngit push origin --delete feature/login" },
  { category: "分支管理", title: "变基 Rebase", description: "将当前分支变基到目标分支", code: "git rebase main" },

  // 远程操作
  { category: "远程操作", title: "添加远程仓库", description: "关联远程仓库地址", code: "git remote add origin https://github.com/user/repo.git" },
  { category: "远程操作", title: "查看远程仓库", description: "查看已关联的远程仓库", code: "git remote -v" },
  { category: "远程操作", title: "推送到远程", description: "将本地提交推送到远程", code: "# 推送当前分支\ngit push\n# 首次推送并设置上游\ngit push -u origin main" },
  { category: "远程操作", title: "拉取远程更新", description: "拉取并合并远程更新", code: "# 拉取并合并\ngit pull\n# 拉取但不合并\ngit fetch\n# 拉取指定分支\ngit pull origin develop" },

  // 撤销与回退
  { category: "撤销与回退", title: "撤销工作区修改", description: "恢复文件到上次提交的状态", code: "git checkout -- file.txt\n# 或\ngit restore file.txt" },
  { category: "撤销与回退", title: "取消暂存", description: "将文件从暂存区移除", code: "git reset HEAD file.txt\n# 或\ngit restore --staged file.txt" },
  { category: "撤销与回退", title: "修改上次提交", description: "修改最近一次 commit 的信息或内容", code: "git commit --amend -m \"new message\"" },
  { category: "撤销与回退", title: "回退到指定提交", description: "将 HEAD 移回到指定 commit", code: "# 保留修改（默认）\ngit reset --soft HEAD~1\n# 保留工作区\ngit reset --mixed HEAD~1\n# 丢弃所有修改\ngit reset --hard HEAD~1" },
  { category: "撤销与回退", title: "创建反向提交", description: "生成一个撤销指定 commit 的新提交", code: "git revert abc1234" },

  // 暂存
  { category: "暂存", title: "暂存当前修改", description: "将未提交的修改临时保存", code: "git stash" },
  { category: "暂存", title: "暂存并命名", description: "保存并给一个描述", code: "git stash save \"work in progress\"" },
  { category: "暂存", title: "查看暂存列表", description: "查看所有暂存的修改", code: "git stash list" },
  { category: "暂存", title: "恢复暂存", description: "恢复最近一次暂存的修改", code: "# 恢复并保留暂存记录\ngit stash apply\n# 恢复并删除暂存记录\ngit stash pop" },

  // 标签
  { category: "标签", title: "创建标签", description: "为当前提交打标签", code: "# 轻量标签\ngit tag v1.0.0\n# 附注标签\ngit tag -a v1.0.0 -m \"Release 1.0.0\"" },
  { category: "标签", title: "推送标签", description: "将标签推送到远程", code: "# 推送单个标签\ngit push origin v1.0.0\n# 推送所有标签\ngit push origin --tags" },
  { category: "标签", title: "查看标签", description: "列出所有标签", code: "git tag" },

  // 查看信息
  { category: "查看信息", title: "查看提交日志", description: "查看 commit 历史", code: "# 简洁模式\ngit log --oneline\n# 图形模式\ngit log --oneline --graph --all\n# 最近 5 条\ngit log -5" },
  { category: "查看信息", title: "查看文件修改历史", description: "查看单个文件的提交历史", code: "git log --follow -p file.txt" },
  { category: "查看信息", title: "查看某次提交", description: "查看指定 commit 的详细信息", code: "git show abc1234" },
  { category: "查看信息", title: "查看每行作者", description: "查看文件每一行的最后修改人", code: "git blame file.txt" },

  // 高级操作
  { category: "高级操作", title: "Cherry-pick", description: "将指定 commit 应用到当前分支", code: "git cherry-pick abc1234" },
  { category: "高级操作", title: "交互式 Rebase", description: "合并/编辑/重排最近 N 个提交", code: "git rebase -i HEAD~3" },
  { category: "高级操作", title: "清理未跟踪文件", description: "删除工作区中未跟踪的文件", code: "# 预览\ngit clean -nd\n# 执行\ngit clean -fd" },
  { category: "高级操作", title: "二分查找 Bug", description: "用二分法定位引入 Bug 的提交", code: "git bisect start\ngit bisect bad          # 当前有bug\ngit bisect good v1.0.0  # 这个版本没bug\n# Git 会自动切换版本，测试后标记 good/bad\ngit bisect reset         # 结束" },
];

export default function GitCheatSheetPage() {
  return (
    <ToolPageWrapper>
      <CheatSheet
        title="Git 命令速查"
        subtitle="Git 日常开发常用命令速查，支持搜索和一键复制"
        items={items}
        categories={categories}
      />
    </ToolPageWrapper>
  );
}
