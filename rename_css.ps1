$f = 'c:\Users\guilh\Downloads\MarIA-main\index.html'
$c = [System.IO.File]::ReadAllText($f)

# ══ BATCH 1: Stats, Steps, Cases, Plans ══

# stat-c → stat-card, stat-v → stat-value, stat-l → stat-label
$c = $c.Replace('.stat-c{', '.stat-card{').Replace('class="stat-c"', 'class="stat-card"')
$c = $c.Replace('.stat-v{', '.stat-value{').Replace('class="stat-v"', 'class="stat-value"')
$c = $c.Replace('.stat-l{', '.stat-label{').Replace('class="stat-l"', 'class="stat-label"')

# step-c → step-card, step-n → step-number
$c = $c.Replace('.step-c{', '.step-card{').Replace('.step-c h3', '.step-card h3').Replace('.step-c p', '.step-card p')
$c = $c.Replace('class="step-c"', 'class="step-card"')
$c = $c.Replace('.step-n{', '.step-number{').Replace('class="step-n"', 'class="step-number"')

# case-c → case-card, case-co → case-company, case-q → case-quote, case-pub → case-published
$c = $c.Replace('.case-c{', '.case-card{').Replace('class="case-c"', 'class="case-card"')
$c = $c.Replace('.case-co{', '.case-company{').Replace('class="case-co"', 'class="case-company"')
$c = $c.Replace('.case-q{', '.case-quote{').Replace('class="case-q"', 'class="case-quote"')
$c = $c.Replace('.case-pub{', '.case-published{').Replace('class="case-pub"', 'class="case-published"')

# plan-c → plan-card (.plan-c.hl → .plan-card.highlight)
$c = $c.Replace('.plan-c{', '.plan-card{').Replace('.plan-c.hl{', '.plan-card.highlight{')
$c = $c.Replace('class="plan-c"', 'class="plan-card"').Replace('class="plan-c hl"', 'class="plan-card highlight"')
$c = $c.Replace('.plan-pop{', '.plan-popular{').Replace('class="plan-pop"', 'class="plan-popular"')
$c = $c.Replace('.plan-btn.p{', '.plan-btn.primary{').Replace('class="plan-btn p"', 'class="plan-btn primary"')
$c = $c.Replace('.plan-btn.s{', '.plan-btn.secondary{').Replace('class="plan-btn s"', 'class="plan-btn secondary"')

# ══ BATCH 2: Sidebar, Dashboard metrics, Badges ══

# sb-item → sidebar-item, sb-icon → sidebar-icon, sb-div → sidebar-divider
$c = $c.Replace('.sb-item{', '.sidebar-item{').Replace('.sb-item:', '.sidebar-item:').Replace('.sb-item.on', '.sidebar-item.on')
$c = $c.Replace('class="sb-item"', 'class="sidebar-item"').Replace('class="sb-item on"', 'class="sidebar-item on"')
$c = $c.Replace('.sb-icon{', '.sidebar-icon{').Replace('class="sb-icon"', 'class="sidebar-icon"')
$c = $c.Replace('.sb-div{', '.sidebar-divider{').Replace('class="sb-div"', 'class="sidebar-divider"')

# sb-cred → sidebar-credits
$c = $c.Replace('.sb-cred{', '.sidebar-credits{').Replace('.sb-cred .lbl', '.sidebar-credits .lbl').Replace('.sb-cred .val', '.sidebar-credits .val')
$c = $c.Replace('class="sb-cred"', 'class="sidebar-credits"')

# sb-user → sidebar-user
$c = $c.Replace('.sb-user{', '.sidebar-user{').Replace('.sb-user .av', '.sidebar-user .av').Replace('.sb-user .info', '.sidebar-user .info').Replace('.sb-user .name', '.sidebar-user .name').Replace('.sb-user .email', '.sidebar-user .email')
$c = $c.Replace('class="sb-user"', 'class="sidebar-user"')

# met → metric-card, mv → metric-value, ml → metric-label
$c = $c.Replace('.met{', '.metric-card{').Replace('.met .mv', '.metric-card .metric-value').Replace('.met .ml', '.metric-card .metric-label')
$c = $c.Replace('class="met"', 'class="metric-card"')
$c = $c.Replace('class="mv"', 'class="metric-value"')
$c = $c.Replace('class="ml"', 'class="metric-label"')

# met4 → metrics-4col
$c = $c.Replace('.met4{', '.metrics-4col{').Replace('.met4 .met', '.metrics-4col .metric-card')
$c = $c.Replace('class="met4"', 'class="metrics-4col"')

# Badge status: b-r → badge-review, b-a → badge-approved, b-s → badge-sent, b-d → badge-draft
$c = $c.Replace('.b-r{', '.badge-review{').Replace("'b-r'", "'badge-review'")
$c = $c.Replace('.b-a{', '.badge-approved{').Replace("'b-a'", "'badge-approved'")
$c = $c.Replace('.b-s{', '.badge-sent{').Replace("'b-s'", "'badge-sent'")
$c = $c.Replace('.b-d{', '.badge-draft{').Replace("'b-d'", "'badge-draft'")

# ══ BATCH 3: Chat, Feed, Curadoria, Waitlist Admin ══

# av-m → avatar-maria
$c = $c.Replace('.av-m{', '.avatar-maria{').Replace('class="av-m"', 'class="avatar-maria"')

# ri → recent-item, ri-av → recent-avatar
$c = $c.Replace('.ri{', '.recent-item{').Replace('.ri:', '.recent-item:')
$c = $c.Replace('class="ri"', 'class="recent-item"')
$c = $c.Replace('.ri-av{', '.recent-avatar{').Replace('class="ri-av"', 'class="recent-avatar"')

# td → typing-dot (CSS only - used in animation)
$c = $c.Replace('.td{', '.typing-dot{').Replace('.td:', '.typing-dot:')
$c = $c.Replace('class="td"', 'class="typing-dot"')

# msg-b → msg-body, msg-av → msg-avatar
$c = $c.Replace('.msg-b{', '.msg-body{').Replace('class="msg-b"', 'class="msg-body"')
$c = $c -replace 'class="msg-av u"', 'class="msg-avatar user"' -replace 'class="msg-av"', 'class="msg-avatar"'
$c = $c.Replace('.msg-av{', '.msg-avatar{').Replace('.msg-av.u{', '.msg-avatar.user{')

# feed: m-b → match-badge, c-b → category-badge, f-p → feed-pass, f-l → feed-like
$c = $c.Replace('.m-b{', '.match-badge{').Replace('class="m-b"', 'class="match-badge"')
$c = $c.Replace('.c-b{', '.category-badge{').Replace('class="c-b"', 'class="category-badge"')
$c = $c.Replace('.f-p{', '.feed-pass{').Replace('.f-p:', '.feed-pass:')
$c = $c.Replace('class="f-p"', 'class="feed-pass"')
$c = $c.Replace('.f-l{', '.feed-like{').Replace('.f-l:', '.feed-like:')
$c = $c.Replace("class=""f-l""", "class=""feed-like""")

# feed-c → feed-card
$c = $c.Replace('.feed-c{', '.feed-card{').Replace('.feed-c:', '.feed-card:')
$c = $c.Replace('class="feed-c"', 'class="feed-card"')

# curadoria: cb-a → curation-approve, cb-d → curation-devolver, cb-r → curation-reject
$c = $c.Replace('.cb-a{', '.curation-approve{').Replace('.cb-a:', '.curation-approve:')
$c = $c.Replace('class="cb-a"', 'class="curation-approve"')
$c = $c.Replace('.cb-d{', '.curation-devolver{').Replace('.cb-d:', '.curation-devolver:')
$c = $c.Replace('class="cb-d"', 'class="curation-devolver"')
$c = $c.Replace('.cb-r{', '.curation-reject{').Replace('.cb-r:', '.curation-reject:')
$c = $c.Replace('class="cb-r"', 'class="curation-reject"')

# mp-t → match-preview-title
$c = $c.Replace('.mp-t{', '.match-preview-title{').Replace('class="mp-t"', 'class="match-preview-title"')

# cur-st.p → cur-st.pending, cur-st.a → cur-st.approved  
$c = $c.Replace('.cur-st.p{', '.cur-st.pending{').Replace('.cur-st.a{', '.cur-st.approved{')

# Waitlist admin: t-hd → table-header, t-rw → table-row, t-em → table-name, t-sg → table-sub, t-act → table-action
$c = $c.Replace('.t-hd{', '.table-header{').Replace('.t-hd ', '.table-header ')
$c = $c.Replace('class="t-hd"', 'class="table-header"')
$c = $c.Replace('.t-rw{', '.table-row{').Replace('.t-rw:', '.table-row:').Replace('.t-rw>', '.table-row>')
$c = $c.Replace('class="t-rw"', 'class="table-row"')
$c = $c.Replace('.t-em{', '.table-name{').Replace('class="t-em"', 'class="table-name"')
$c = $c.Replace('.t-sg{', '.table-sub{').Replace('class="t-sg"', 'class="table-sub"')
$c = $c.Replace('.t-act{', '.table-action{').Replace('.t-act:', '.table-action:')
$c = $c.Replace('class="t-act"', 'class="table-action"')

# fi → filter-input
$c = $c.Replace('.fi{', '.filter-input{').Replace('.fi:', '.filter-input:')
$c = $c.Replace('class="fi"', 'class="filter-input"')

# aa-btn → admin-action-btn, aa-btn.p → admin-action-btn.primary
$c = $c.Replace('.aa-btn{', '.admin-action-btn{').Replace('.aa-btn:', '.admin-action-btn:').Replace('.aa-btn.p{', '.admin-action-btn.primary{')
$c = $c.Replace('class="aa-btn"', 'class="admin-action-btn"').Replace('class="aa-btn p"', 'class="admin-action-btn primary"')

# act-btn → release-action, act-btn.p → release-action.primary
$c = $c.Replace('.act-btn{', '.release-action{').Replace('.act-btn:', '.release-action:').Replace('.act-btn.p{', '.release-action.primary{')
$c = $c.Replace('class="act-btn"', 'class="release-action"').Replace('class="act-btn p"', 'class="release-action primary"')

# ham → hamburger
$c = $c.Replace('.ham{', '.hamburger{').Replace('.ham.open', '.hamburger.open').Replace('.ham ', '.hamburger ')
$c = $c.Replace('class="ham"', 'class="hamburger"').Replace('class="ham open"', 'class="hamburger open"')

# mob-btn → mobile-btn
$c = $c.Replace('.mob-btn{', '.mobile-btn{').Replace('.mob-btn:', '.mobile-btn:')
$c = $c.Replace('class="mob-btn"', 'class="mobile-btn"')

# empty-st → empty-state
$c = $c.Replace('.empty-st{', '.empty-state{')
$c = $c.Replace('class="empty-st"', 'class="empty-state"')
$c = $c.Replace('class=\"empty-st\"', 'class=\"empty-state\"')

# story-ic → story-icon
$c = $c.Replace('.story-ic{', '.story-icon{').Replace('class="story-ic"', 'class="story-icon"')

# seg-chip.sel → seg-chip.selected
$c = $c.Replace('.seg-chip.sel{', '.seg-chip.selected{').Replace('class="seg-chip sel"', 'class="seg-chip selected"')

# cl → credit-label, cv → credit-value (in .chat-cred context)
$c = $c.Replace('.chat-cred .cl{', '.chat-cred .credit-label{').Replace('class="cl"', 'class="credit-label"')
$c = $c.Replace('.chat-cred .cv{', '.chat-cred .credit-value{').Replace('class="cv"', 'class="credit-value"')

# sb-confirmed → status-confirmed, sb-pending → status-pending
$c = $c.Replace('.sb-confirmed{', '.status-confirmed{')
$c = $c.Replace('sb-confirmed', 'status-confirmed')
$c = $c.Replace('.sb-pending{', '.status-pending{')
$c = $c -replace "sb-pending'", "status-pending'"
$c = $c.Replace('class="sb-pending"', 'class="status-pending"')

# success-scr → success-screen, success-ic → success-icon
$c = $c.Replace('.success-scr{', '.success-screen{').Replace('class="success-scr"', 'class="success-screen"').Replace('class=\"success-scr\"', 'class=\"success-screen\"')
$c = $c.Replace('.success-ic{', '.success-icon{').Replace('class="success-ic"', 'class="success-icon"').Replace('class=\"success-ic\"', 'class=\"success-icon\"')

# dot-on → status-dot
$c = $c.Replace('.dot-on{', '.status-dot{').Replace('class="dot-on"', 'class="status-dot"')

# jrn-link → journalist-link
$c = $c.Replace('.jrn-link{', '.journalist-link{').Replace('.jrn-link a', '.journalist-link a')
$c = $c.Replace('class="jrn-link"', 'class="journalist-link"')

# cred-bar → credit-bar, cred-bar-f → credit-bar-fill
$c = $c.Replace('.cred-bar{', '.credit-bar{').Replace('class="cred-bar"', 'class="credit-bar"')
$c = $c.Replace('.cred-bar-f{', '.credit-bar-fill{').Replace('class="cred-bar-f"', 'class="credit-bar-fill"')

# Also handle JS references to sb-cred-bar, sb-cred-val
$c = $c.Replace("'sb-cred-bar'", "'sidebar-cred-bar'")
$c = $c.Replace("id=""sb-cred-bar""", "id=""sidebar-cred-bar""")
$c = $c.Replace("'sb-cred-val'", "'sidebar-cred-val'")
$c = $c.Replace("id=""sb-cred-val""", "id=""sidebar-cred-val""")

# rel-wrap → release-wrap, rel-hdr → release-header, rel-acts → release-actions
$c = $c.Replace('.rel-wrap{', '.release-wrap{').Replace('.rel-wrap.vis', '.release-wrap.visible')
$c = $c.Replace('class="rel-wrap"', 'class="release-wrap"')
$c = $c.Replace("'rel-wrap'", "'release-wrap'")
$c = $c.Replace('.rel-hdr{', '.release-header{').Replace('.rel-hdr ', '.release-header ')
$c = $c.Replace('class="rel-hdr"', 'class="release-header"')
$c = $c.Replace('.rel-acts{', '.release-actions{')
$c = $c.Replace('class="rel-acts"', 'class="release-actions"')
$c = $c.Replace("'.rel-acts'", "'.release-actions'")

# qual-bar → quality-bar
$c = $c.Replace('.qual-bar{', '.quality-bar{').Replace('.qual-bar ', '.quality-bar ')
$c = $c.Replace('class="qual-bar"', 'class="quality-bar"').Replace('class=\"qual-bar\"', 'class=\"quality-bar\"')

# feed-c used in ID pattern fc-
# Update only CSS class, not the fc- ID prefix

[System.IO.File]::WriteAllText($f, $c, [System.Text.Encoding]::UTF8)
Write-Output "CSS rename complete"
