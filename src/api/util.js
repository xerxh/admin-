import request from '@/utils/request'

// 老师管理URL
export const teacherAddUrl = '/hart/kss/admin/teacher/addTeacher'
export const teacherUpUrl = '/hart/kss/admin/teacher/updateTeacher'
export const teacherDelUrl = '/hart/kss/admin/teacher/delTeacher'

// 文章管理Url
export const articleAddUrl = '/hart/kss/admin/article/addArticle'
export const articleUpUrl = '/hart/kss/admin/article/updateArticle'
export const articleDelUrl = '/hart/kss/admin/article/delArticle'

// 课程管理Url
export const courseAddUrl = '/hart/kss/admin/curriculum/addCurriculum'
export const courseUpUrl = '/hart/kss/admin/curriculum/updateCurriculum'
export const courseDelUrl = '/hart/kss/admin/curriculum/delCurriculum'
export const teacherUrl = '/hart/kss/admin/curriculum/getCurriculumTeacherList'
export const courseRecommend = '/hart/kss/admin/curriculum/addCurriculumRecommends'
export const courseRecommendList = '/hart/kss/admin/curriculum/getCurriculumRecommendList'
// 获取能推荐的课程列表
export const courseCurriculumKList = '/hart/kss/admin/curriculum/getCurriculumKList'
// 系统管理Url
export const systemAddUrl = '/hart/kss/admin/system/addCriteria'
export const systemUpUrl = '/hart/kss/admin/system/updateCriteria'
export const systemDelUrl = '/hart/kss/admin/system/delCriteria'
export const systemUrl = '/hart/kss/admin/system/getCriteriaList'

// 评论Url
export const recommendAddUrl = '/hart/kss/admin/comment/addComment'
export const recommendUpUrl = '/hart/kss/admin/comment/updateComment'
export const recommendDelUrl = '/hart/kss/admin/comment/delComment'
export const recommendUrl = '/hart/kss/admin/comment/getCommentList'

// 运营管理Url
export const feedbackUrl = '/hart/kss/admin/feedback/getFeedbackList'

// 课程下的视频
export const videoDelUrl = '/hart/kss/admin/curriculum/delCurriculumVideo'
export const videoListUrl = '/hart/kss/admin/curriculum/getCurriculumVideoList'
export const videoUpUrl = '/hart/kss/admin/curriculum/updateCurriculumVedio '
// 添加关联视频
export const videoSonAddUrl = '/hart/kss/admin/curriculum/addCurriculumVedio'

// pdf管理
export const pdfAddUrl = '/hart/kss/admin/system/addFile'
export const pdfDelUrl = '/hart/kss/admin/system/delFile'
export const pdfListUrl = '/hart/kss/admin/system/getFileList'

export function crudList(params, url) {
  console.log(url)
  return request({
    url: url,
    method: 'post',
    data: params
  })
}

export function Get(url) {
  return request({
    url: url,
    method: 'get'
  })
}
