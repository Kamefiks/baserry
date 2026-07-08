interface SidebarSectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}

export function SidebarSection({ title, icon, children }: SidebarSectionProps) {
  return (
    <div className="pb-5">
      <div className="flex items-center gap-2 px-3 pb-3 text-xs font-semibold  text-gray-500 uppercase ">
        <div >{icon}</div>
        <span className="font-bold">{title}</span>
      </div>
      <div className="flex gap-1 ml-5 border-[#c4c4c4] border-l-[3px] pl-2  flex-col">{children}</div>
    </div>
  )
}