/**
 * Chuyển đổi một mảng phẳng thành cấu trúc cây (Tree structure)
 * @param list Mảng dữ liệu phẳng đầu vào
 * @param props Các thuộc tính tùy chỉnh cho id, parentId và children
 * @returns Mảng đã được cấu trúc thành cây
 */
export const arrayToTree = <T>(
  list: T[],
  props: { id: keyof T; parentId: keyof T; children?: string } = {
    id: 'id' as keyof T,
    parentId: 'parent_id' as keyof T,
    children: 'children',
  },
): any[] => {
  const { id, parentId, children = 'children' } = props
  const map: Record<string | number, any> = {}
  const roots: any[] = []

  // Bước 1: Tạo Map và khởi tạo field children
  list.forEach((item) => {
    map[item[id] as any] = { ...item, [children]: [] }
  })

  // Bước 2: Xây dựng cây
  list.forEach((item) => {
    const node = map[item[id] as any]
    const parentVal = item[parentId]

    if (parentVal === null || parentVal === undefined || parentVal === 0) {
      roots.push(node)
    } else {
      const parent = map[parentVal as any]
      if (parent) {
        parent[children].push(node)
      } else {
        roots.push(node)
      }
    }
  })

  return roots
}
