import type {
  ProjectItem, UnitItem, InquiryItem, NewsItem, CareerItem, TimelineItem, PaymentItem,
  SiteSettings, AuditLogItem, JobApplicationItem, PropertyItem, ListingItem, AgentItem,
  OwnerItem, CustomerItem, LeadItem, ViewingItem, OfferItem, DealItem, CommissionItem,
  DocumentRecord,
} from '@/types';

const configuredApiBase = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL;
const API_BASE = (configuredApiBase || (process.env.NODE_ENV === 'production' ? 'https://api.tanmiyatrealestate.com/api' : 'http://localhost:4000/api')).replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { Accept: 'application/json', ...(init?.headers || {}) },
    cache: init?.cache || 'no-store',
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.success === false) throw new Error(json.error || `API request failed (${response.status})`);
  return json.data as T;
}

export const repository = {
  async getProjects(filter?: { category?: string; status?: string }): Promise<ProjectItem[]> {
    const p = new URLSearchParams(); if (filter?.category) p.set('category', filter.category); if (filter?.status) p.set('status', filter.status);
    return request<ProjectItem[]>(`/projects${p.toString() ? `?${p}` : ''}`);
  },
  async getProjectBySlug(slug: string): Promise<ProjectItem | null> { try { return await request<ProjectItem>(`/projects/${encodeURIComponent(slug)}`); } catch { return null; } },
  async getProjectById(id: string): Promise<ProjectItem | null> { try { return await request<ProjectItem>(`/projects/${encodeURIComponent(id)}`); } catch { return null; } },
  async createProject(data: Omit<ProjectItem,'id'>): Promise<ProjectItem> { return request('/projects',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); },
  async updateProject(id:string,updates:Partial<ProjectItem>):Promise<ProjectItem|null>{return request<ProjectItem>(`/projects/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(updates)}).catch(()=>null)},
  async deleteProject(id:string):Promise<boolean>{await request(`/projects/${id}`,{method:'DELETE'});return true;},

  async getUnitsByProject(projectId:string):Promise<UnitItem[]>{return request(`/units?projectId=${encodeURIComponent(projectId)}`)},
  async getAllUnits():Promise<UnitItem[]>{return request('/units')},
  async getUnitById(id:string):Promise<UnitItem|null>{try{return await request(`/units/${id}`)}catch{return null}},
  async updateUnitStatus(id:string,status:UnitItem['status']):Promise<UnitItem|null>{try{return await request(`/units/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})})}catch{return null}},
  async createUnit(data:Omit<UnitItem,'id'>):Promise<UnitItem>{return request('/units',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})},

  async getInquiries():Promise<InquiryItem[]>{return request('/inquiries')},
  async createInquiry(data:Omit<InquiryItem,'id'|'status'|'createdAt'>):Promise<InquiryItem>{return request('/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})},
  async updateInquiryStatus(id:string,status:InquiryItem['status'],notes?:string):Promise<InquiryItem|null>{try{return await request(`/inquiries/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status,notes})})}catch{return null}},

  async getNews():Promise<NewsItem[]>{return request('/news')},
  async getNewsBySlug(slug:string):Promise<NewsItem|null>{try{return await request(`/news/${encodeURIComponent(slug)}`)}catch{return null}},
  async createNews(data:Omit<NewsItem,'id'>):Promise<NewsItem>{return request('/news',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})},
  async getCareers():Promise<CareerItem[]>{return request('/careers')},
  async getAllCareersAdmin():Promise<CareerItem[]>{return request('/careers?admin=true')},
  async getCareerBySlug(slug:string):Promise<CareerItem|null>{try{return await request(`/careers/${encodeURIComponent(slug)}`)}catch{return null}},
  async submitJobApplication(data:Omit<JobApplicationItem,'id'|'createdAt'>):Promise<JobApplicationItem>{return request('/careers/applications',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})},
  async getJobApplications():Promise<JobApplicationItem[]>{return request('/careers/applications')},
  async getTimeline():Promise<TimelineItem[]>{return request('/timeline')},
  async getPayments():Promise<PaymentItem[]>{return request('/payments')},
  async recordPayment(data:Omit<PaymentItem,'id'|'createdAt'>):Promise<PaymentItem>{return request('/payments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})},
  async getSettings():Promise<SiteSettings>{return request('/settings')},
  async updateSettings(updates:Partial<SiteSettings>):Promise<SiteSettings>{return request('/settings',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(updates)})},
  async getAuditLogs():Promise<AuditLogItem[]>{return request('/audit-logs')},
  async getDashboardStats(){return request('/admin/stats')},

  async getProperties(params?:Record<string,unknown>):Promise<{properties:PropertyItem[];total:number;page:number;limit:number;totalPages:number}>{const p=new URLSearchParams();for(const [k,v] of Object.entries(params||{}))if(v!==undefined&&v!==null)p.set(k,String(v));const response=await fetch(`${API_BASE}/properties${p.toString()?`?${p}`:''}`,{cache:'no-store'});const json=await response.json();if(!response.ok||!json.success)throw new Error(json.error||'Failed to load properties');return {properties:json.data||[],total:json.meta?.total||0,page:json.meta?.page||1,limit:json.meta?.limit||12,totalPages:json.meta?.totalPages||1};},
  async getPropertyBySlug(slug:string):Promise<PropertyItem|null>{try{return await request(`/properties/${encodeURIComponent(slug)}`)}catch{return null}},
  async getPropertyById(id:string):Promise<PropertyItem|null>{try{return await request(`/properties/${encodeURIComponent(id)}`)}catch{return null}},
  async createProperty(data:Omit<PropertyItem,'id'>,userEmail?:string):Promise<PropertyItem>{return request('/properties',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,userEmail})})},
  async updateProperty(id:string,updates:Partial<PropertyItem>,userEmail?:string):Promise<PropertyItem|null>{try{return await request(`/properties/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({...updates,userEmail})})}catch{return null}},
  async duplicateProperty(id:string,userEmail?:string):Promise<PropertyItem|null>{try{return await request(`/properties/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'DUPLICATE',userEmail})})}catch{return null}},
  async updatePropertyWorkflow(id:string,workflowStatus:string,userEmail?:string):Promise<PropertyItem|null>{try{return await request(`/properties/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'WORKFLOW_CHANGE',workflowStatus,userEmail})})}catch{return null}},
  async deleteProperty(id:string,userEmail?:string):Promise<boolean>{await request(`/properties/${id}`,{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({userEmail})});return true},
  async getListings(filter?:Record<string,unknown>):Promise<ListingItem[]>{const p=new URLSearchParams();for(const[k,v]of Object.entries(filter||{}))if(v)p.set(k,String(v));return request(`/listings${p.toString()?`?${p}`:''}`)},
  async createListing(data:Omit<ListingItem,'id'>):Promise<ListingItem>{return request('/listings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})},
  async getAgents(filter?:{status?:string;area?:string;featured?:boolean}):Promise<AgentItem[]>{const p=new URLSearchParams();for(const[k,v]of Object.entries(filter||{}))if(v!==undefined)p.set(k,String(v));return request(`/agents${p.toString()?`?${p}`:''}`)},
  async getAgentBySlug(slug:string){try{return await request<{agent:AgentItem;properties:PropertyItem[]}>(`/agents/${encodeURIComponent(slug)}`)}catch{return null}},
  async getAgentById(id:string):Promise<AgentItem|null>{try{return await request(`/agents/id/${id}`)}catch{return null}},
  async createAgent(data:Omit<AgentItem,'id'>,userEmail?:string):Promise<AgentItem>{return request('/agents',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,userEmail})})},
  async updateAgent(id:string,updates:Partial<AgentItem>,userEmail?:string):Promise<AgentItem|null>{try{return await request(`/agents/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({...updates,userEmail})})}catch{return null}},
  async getOwners():Promise<OwnerItem[]>{return request('/owners')},
  async getOwnerById(id:string):Promise<OwnerItem|null>{try{return await request(`/owners/${id}`)}catch{return null}},
  async createOwner(data:Omit<OwnerItem,'id'|'createdAt'>,userEmail?:string):Promise<OwnerItem>{return request('/owners',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,userEmail})})},
  async updateOwner(id:string,updates:Partial<OwnerItem>):Promise<OwnerItem|null>{try{return await request(`/owners/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(updates)})}catch{return null}},
  async getCustomers(filter?:{type?:string;agentId?:string}):Promise<CustomerItem[]>{const p=new URLSearchParams();for(const[k,v]of Object.entries(filter||{}))if(v)p.set(k,String(v));return request(`/customers${p.toString()?`?${p}`:''}`)},
  async createCustomer(data:Omit<CustomerItem,'id'|'createdAt'>,userEmail?:string):Promise<CustomerItem>{return request('/customers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,userEmail})})},
  async getLeads(filter?:Record<string,unknown>):Promise<LeadItem[]>{const p=new URLSearchParams();for(const[k,v]of Object.entries(filter||{}))if(v)p.set(k,String(v));return request(`/leads${p.toString()?`?${p}`:''}`)},
  async getLeadById(id:string):Promise<LeadItem|null>{try{return await request(`/leads/${id}`)}catch{return null}},
  async createLead(data:Partial<LeadItem>,initialNote?:string,userEmail?:string):Promise<LeadItem>{return request('/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,initialNote,userEmail})})},
  async updateLeadStage(id:string,stage:LeadItem['stage'],note?:string,userEmail?:string):Promise<LeadItem|null>{try{return await request(`/leads/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({stage,note,userEmail})})}catch{return null}},
  async updateLead(id:string,updates:Partial<LeadItem>,userEmail?:string):Promise<LeadItem|null>{try{return await request(`/leads/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({...updates,userEmail})})}catch{return null}},
  async getViewings(filter?:Record<string,unknown>):Promise<ViewingItem[]>{const p=new URLSearchParams();for(const[k,v]of Object.entries(filter||{}))if(v)p.set(k,String(v));return request(`/viewings${p.toString()?`?${p}`:''}`)},
  async createViewing(data:Omit<ViewingItem,'id'|'createdAt'>,userEmail?:string):Promise<ViewingItem>{return request('/viewings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,userEmail})})},
  async updateViewingStatus(id:string,status:ViewingItem['status'],notes?:string,userEmail?:string):Promise<ViewingItem|null>{try{return await request(`/viewings/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status,notes,userEmail})})}catch{return null}},
  async getOffers(filter?:Record<string,unknown>):Promise<OfferItem[]>{const p=new URLSearchParams();for(const[k,v]of Object.entries(filter||{}))if(v)p.set(k,String(v));return request(`/offers${p.toString()?`?${p}`:''}`)},
  async createOffer(data:Omit<OfferItem,'id'|'createdAt'>,userEmail?:string):Promise<OfferItem>{return request('/offers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})},
  async updateOfferStatus(id:string,status:OfferItem['status'],notes?:string,userEmail?:string):Promise<OfferItem|null>{try{return await request(`/offers/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status,notes,userEmail})})}catch{return null}},
  async getDeals(filter?:Record<string,unknown>):Promise<DealItem[]>{const p=new URLSearchParams();for(const[k,v]of Object.entries(filter||{}))if(v)p.set(k,String(v));return request(`/deals${p.toString()?`?${p}`:''}`)},
  async createDeal(data:Omit<DealItem,'id'|'createdAt'>,userEmail?:string):Promise<DealItem>{return request('/deals',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,userEmail})})},
  async updateDeal(id:string,updates:Partial<DealItem>,userEmail?:string):Promise<DealItem|null>{try{return await request(`/deals/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({...updates,userEmail})})}catch{return null}},
  async getCommissions(filter?:Record<string,unknown>):Promise<CommissionItem[]>{const p=new URLSearchParams();for(const[k,v]of Object.entries(filter||{}))if(v)p.set(k,String(v));return request(`/commissions${p.toString()?`?${p}`:''}`)},
  async updateCommissionStatus(id:string,status:CommissionItem['status'],paidDate?:string,userEmail?:string):Promise<CommissionItem|null>{try{return await request(`/commissions/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status,paidDate,userEmail})})}catch{return null}},
  async getDocuments(filter?:Record<string,unknown>):Promise<DocumentRecord[]>{const p=new URLSearchParams();for(const[k,v]of Object.entries(filter||{}))if(v)p.set(k,String(v));return request(`/documents${p.toString()?`?${p}`:''}`)},
  async addDocument(data:Omit<DocumentRecord,'id'|'uploadedAt'>,userEmail?:string):Promise<DocumentRecord>{return request('/documents',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,userEmail})})},
};
