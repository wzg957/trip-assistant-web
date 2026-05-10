<div class="content-scroll">
  <div class="info-item">
    <span class="label">💡 综合建议：</span>
    <span class="text">{{ mockPlan.overall_suggestions || '无' }}</span>
  </div>

  <div class="detail-section">
    <h4>📋 详细日程编排</h4>
    <div class="itinerary-box">
      <div v-if="mockPlan.days && mockPlan.days.length > 0">
        <div v-for="day in mockPlan.days" :key="day.day_index" style="margin-bottom: 30px; border-bottom: 1px dashed #ebeef5; padding-bottom: 20px;">
          
          <h5 style="color: #409eff; font-size: 18px; margin-bottom: 12px; display: flex; align-items: center;">
            <span style="background: #409eff; color: white; padding: 2px 8px; border-radius: 4px; margin-right: 10px; font-size: 14px;">Day {{ day.day_index + 1 }}</span>
            {{ day.date }} - {{ day.description }}
          </h5>

          <div style="background: #fdf6ec; color: #e6a23c; padding: 10px 15px; border-radius: 6px; font-size: 14px; margin-bottom: 15px; border: 1px solid #faecd8; display: flex; align-items: center;">
            <span style="font-size: 16px; margin-right: 8px;">🚕</span>
            <strong>交通策略：</strong> <span style="margin-left: 5px; color: #606266;">{{ day.transportation || '建议视具体距离打车或公交' }}</span>
          </div>

          <div v-if="day.hotel" style="margin: 15px 0; display: flex; gap: 15px; background: #f4f4f5; padding: 12px; border-radius: 8px; border: 1px solid #e9e9eb;">
            <el-image 
              v-if="day.hotel.image_url" 
              :src="day.hotel.image_url" 
              style="width: 90px; height: 90px; border-radius: 8px; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" 
              fit="cover" lazy>
              <template #error><div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e5e9f2;color:#909399;font-size:12px;">暂无图片</div></template>
            </el-image>
            <div style="flex-grow: 1;">
              <div style="font-weight: bold; font-size: 16px; color: #303133;">🏨 {{ day.hotel.name }}</div>
              <div style="font-size: 13px; color: #606266; margin-top: 6px;">📍 {{ day.hotel.address }}</div>
              <div style="font-size: 13px; color: #606266; margin-top: 4px;">{{ day.accommodation }}</div>
              <div style="margin-top: 6px;"><el-tag size="small" type="success">预估 ¥{{ day.hotel.estimated_cost }}</el-tag></div>
            </div>
          </div>
          <p v-else-if="day.accommodation" style="margin: 5px 0; color: #606266; font-size: 14px;"><strong>🏨 住宿建议：</strong>{{ day.accommodation }}</p>

          <div v-if="day.attractions && day.attractions.length > 0" style="margin-top: 20px;">
            <strong style="font-size: 15px; color: #303133;">🚩 景点安排：</strong>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
              <div v-for="(attr, index) in day.attractions" :key="index" style="display: flex; gap: 15px; background: #fff; border: 1px solid #ebeef5; padding: 12px; border-radius: 8px; transition: box-shadow 0.3s;" onmouseover="this.style.boxShadow='0 2px 12px 0 rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
                <el-image 
                  v-if="attr.image_url" 
                  :src="attr.image_url" 
                  style="width: 90px; height: 90px; border-radius: 6px; flex-shrink: 0;" 
                  fit="cover" lazy>
                  <template #error><div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e5e9f2;color:#909399;font-size:12px;">暂无图片</div></template>
                </el-image>
                <div style="flex-grow: 1;">
                  <div style="font-weight: bold; font-size: 15px; color: #303133;">{{ attr.name }} <el-tag size="small" type="warning" style="margin-left: 8px;">游玩约 {{ attr.visit_duration }} 分钟</el-tag></div>
                  <div style="font-size: 13px; color: #606266; margin-top: 6px; line-height: 1.5;">{{ attr.description }}</div>
                  <div v-if="attr.estimated_cost" style="font-size: 13px; color: #909399; margin-top: 4px;">门票预估: ¥{{ attr.estimated_cost }}</div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="day.meals && day.meals.length > 0" style="margin-top: 20px;">
            <strong style="font-size: 15px; color: #303133;">🍲 餐饮推荐：</strong>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
              <div v-for="(meal, index) in day.meals" :key="index" style="display: flex; gap: 15px; background: #fffcf5; border: 1px solid #faecd8; padding: 12px; border-radius: 8px;">
                <el-image 
                  v-if="meal.image_url" 
                  :src="meal.image_url" 
                  style="width: 80px; height: 80px; border-radius: 6px; flex-shrink: 0;" 
                  fit="cover" lazy>
                  <template #error><div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e5e9f2;color:#909399;font-size:12px;">暂无图片</div></template>
                </el-image>
                <div style="flex-grow: 1;">
                  <div style="font-weight: bold; font-size: 15px; color: #e6a23c;">
                    {{ meal.name }} 
                    <span style="font-size: 13px; color: #909399; font-weight: normal; margin-left: 5px;">({{ meal.type === 'lunch' ? '午餐' : '晚餐' }})</span>
                  </div>
                  <div style="font-size: 13px; color: #606266; margin-top: 6px; line-height: 1.5;">{{ meal.description }}</div>
                  <div style="margin-top: 6px;"><el-tag size="small" type="danger" effect="plain">人均 ¥{{ meal.estimated_cost }}</el-tag></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <pre v-else>{{ mockPlan.planDetails || '暂无排版详情' }}</pre>
    </div>
  </div>
</div>
