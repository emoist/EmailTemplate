const defaultFontFamily = [
  'inherit',
  'Georgia, serif',
  '\'Palatino Linotype\', \'Book Antiqua\', Palatino, serif',
  '\'Times New Roman\', Times, serif',
  'Arial, Helvetica, sans-serif',
  '\'Arial Black\', Gadget, sans-serif',
  '\'Comic Sans MS\', cursive, sans-serif',
  'Impact, Charcoal, sans-serif',
  '\'Lucida Sans Unicode\', \'Lucida Grande\', sans-serif',
  'Tahoma, Geneva, sans-serif',
  '\'Trebuchet MS\', Helvetica, sans-serif',
  'Verdana, Geneva, sans-serif',
  '\'Courier New\', Courier, monospace',
  '\'Lucida Console\', Monaco, monospace',
  'Montserrat'
];

const emailBuilderConfigurations = {
  assetsPath: 'assets',
  authPath: 'auth/layouts', // auth layout
  containerPath: 'container/layouts', // email container
  defaultLayout: 'modern', // modern or material
  defaultSkin: 'dark', // light or dark
  uploadsPath: '',
  layoutsPath: "layouts",
  urlToUploadImage: '//uploads.im/api',
  tinymceBaseUrl: '/bower_components/tinymce',
  translateTemplateUrl: 'i18n/{part}/{lang}.json',
  mjmlPublicKey: '',
  mjmlApplicationId: '',
  mjmlCompileAdress: '/compile', // You can leave it empty if you have mjmlPublicKey and mjmlApplicationId completed from above
  buildFolder: "_dist", // Default distribution folder
  builderTitle: "Angular email builder", // Default builder Title
  builderDescription: "", // Default builder meta description
  UA: "", // Your Google Analytics ID
  exportHtml: true,
  importHtml: true,
  deleteAllBlocks: true,
  trackEvents: false,
  includeMailchimpMergeTags: false,
  defaults: {
    newEmailName: 'My new email template',
    emailOptions: {
      paddingTop: "15px",
      paddingRight: "10px",
      paddingBottom: "15px",
      paddingLeft: "10px",
      backgroundColor: "#fff",
      border: "1px solid #999 dashed"
    }
  },
  disableBlocks: [],
  blocks: {
    'preheader': {
      type: 'preheader',
      sort: 11,
      element: {
        type: 'preheader',
        icon: '&#xE165;',
        primary_head: 'Preheader',
        second_head: 'builder_preheader_comment'
      },
      defaultOptions: {
        align: 'center',
        title: `Voir l'email dans votre navigateur`,
        backgroundColor: '#fff',
        color: '#383838',
        font: {
          size: 11,
          weight: 'normal',
          weightOptions: ['bold', 'bolder', 'lighter', 'inherit', 'initial', 'normal', 100, 200, 300, 400, 500, 600, 700, 800, 900],
          family: 'Arial, Helvetica, sans-serif',
          familyOptions: defaultFontFamily
        },  
      },
      template: `<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background-color:{{element.options.backgroundColor}}" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;"><!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:top;width:600px;">
                        <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:10px 20px;" align="center"><div style="cursor:auto;color:{{element.options.color}};font-family:{{element.options.font.family}};font-size:{{element.options.font.size}}px;font-weight:{{element.options.font.weight}};line-height:13px;text-align:{{element.options.align}};"><!-- text -->
                        <br>{{element.options.title}}
                        </div></td></tr></tbody></table></div><!--[if mso | IE]>
                      </td></tr></table>
                      <![endif]--></td></tr>
                    </tbody>
                  </table>`
    },
    'header-logo': {
      type: 'header-logo',
      sort: 12,
      element: {
        type: 'header-logo',
        icon: '&#xE165;',
        primary_head: 'Header Logo',
        second_head: 'builder_header-logo_comment'
      },
      defaultOptions: {
        backgroundColor: '#7b2b2b',
        align: 'left',
        image: 'http://www.probtp.com/event/upload/docs/image/png/2015-08/logo-probtp.png',
        width: '137',
        altTag: 'logo-probtp',
        linkTo: {
          type: 'link',
          typeOptions: ['link', 'email', 'none'],
          link: `https://www.probtp.com?referer=sitemobile&utm_source=<%= delivery.internalName.toLowerCase() %>&utm_medium=e-mail&utm_content=logo&utm_campaign=<%= ref %>-<%= formatDate(new Date(), '%2M-%4Y') %>`
        },
        color: '#fff',
        font: {
          size: 16,
          weight: 'bold',
          weightOptions: ['bold', 'bolder', 'lighter', 'inherit', 'initial', 'normal', 100, 200, 300, 400, 500, 600, 700, 800, 900],
          family: 'Arial, Ubuntu, Helvetica, sans-serif',
          familyOptions: defaultFontFamily
        },
        text: 'Hello world!'
      },
      template: `<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background-color:{{element.options.backgroundColor}}" align="center" border="0">
                  <tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;"><!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:top;width:600px;">
                      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;font-size:0px;line-height:0px;text-align:left;width:100%;"><!--[if mso | IE]>
                      <table  role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="vertical-align:middle;width:240px;">
                            <![endif]--><div class="mj-column-per-40 outlook-group-fix" style="vertical-align:middle;display:inline-block;direction:ltr;font-size:13px;text-align:{{element.options.width}};width:40%;"><table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:middle;" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:10px;" align="{{element.options.width}}"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="{{element.options.width}}" border="0"><tbody><tr><td style="width:{{element.options.width}}px;"><img alt="{{element.options.altTag}}" height="auto" src="{{element.options.image}}" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="{{element.options.width}}"></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]>
                          </td>
                          <td style="vertical-align:middle;width:360px;">
                            <![endif]--><div class="mj-column-per-60 outlook-group-fix" style="vertical-align:middle;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:60%;"><table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:middle;" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:5px 15px 5px 0px;" align="right"><div style="cursor:auto;color:{{element.options.color}};font-family:{{element.options.font.family}};font-size:{{element.options.font.size}}px;font-weight:{{element.options.font.weight}};line-height:19px;text-align:right;">{{element.options.text}}</div></td></tr></tbody></table></div><!--[if mso | IE]>
                          </td>
                        </tr>
                      </table>
                      <![endif]--></div><!--[if mso | IE]>
                      </td></tr></table>
                      <![endif]--></td></tr>
                    </tbody>
                  </table>`
    },
    'double-text_double-cta': {
      type: 'double-text_double-cta',
      sort: 13,
      element: {
        type: 'preheader',
        icon: '&#xE165;',
        primary_head: 'builder_double-text_double-cta',
        second_head: 'builder_double-text_double-cta_comment'
      },
      defaultOptions: {
      },
      template: `<div style="margin:0px auto;max-width:600px;" data-class=""><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;border:5px solid #E1E1E1;direction:ltr;font-size:0px;padding:0px;"><!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:top;width:300px;">
                <![endif]--><div class="mj-column-per-50 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:300px;"><img alt="" height="auto" src="" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="300"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="center"><div style="cursor:auto;color:#333333;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:14px;line-height:18px;text-align:center;"><!-- text --></div></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;" align="center" border="0"><tbody><tr><td style="border:none;border-radius:0px;color:;cursor:auto;padding:15px 30px;" align="center" valign="middle" bgcolor=""><p style="text-decoration:none;background:;color:;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:16px;font-weight:bold;line-height:120%;text-transform:uppercase;margin:0px;"><!-- button --></p></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]>
                </td><td style="vertical-align:top;width:300px;">
                <![endif]--><div class="mj-column-per-50 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:300px;"><img alt="" height="auto" src="" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="300"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="center"><div style="cursor:auto;color:#333333;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:14px;line-height:18px;text-align:center;"><!-- text --></div></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;" align="center" border="0"><tbody><tr><td style="border:none;border-radius:0px;color:;cursor:auto;padding:15px 30px;" align="center" valign="middle" bgcolor=""><p style="text-decoration:none;background:;color:;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:16px;font-weight:bold;line-height:120%;text-transform:uppercase;margin:0px;"><!-- button --></p></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]>
                </td></tr></table>
                <![endif]--></td></tr></tbody></table></div>`
    },
    'icon': {
      type: 'icon',
      sort: 15,
      element: {
        type: 'preheader',
        icon: '&#xE165;',
        primary_head: 'builder_icon',
        second_head: 'builder_icon_comment'
      },
      defaultOptions: {
      },
      template: `<div style="margin:0px auto;max-width:600px;" data-class=""><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;"><!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:top;width:600px;">
                  <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:600px;"><img alt="" height="auto" src="" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="600"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="center"><div style="cursor:auto;color:#333333;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:14px;line-height:18px;text-align:center;"><!-- text --></div></td></tr></tbody></table></div><!--[if mso | IE]>
                  </td></tr></table>
                  <![endif]--></td></tr></tbody></table></div>`
    },
    'double-icons': {
      type: 'double-icons',
      sort: 16,
      element: {
        type: 'double-icons',
        icon: '&#xE165;',
        primary_head: 'builder_double-icons',
        second_head: 'builder_double-icons_comment'
      },
      defaultOptions: {
      },
      template: `<div style="margin:0px auto;max-width:600px;" data-class=""><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;"><!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:top;width:300px;">
                  <![endif]--><div class="mj-column-per-50 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:300px;"><img alt="" height="auto" src="" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="300"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="center"><div style="cursor:auto;color:#333333;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:14px;line-height:18px;text-align:center;"><!-- text --></div></td></tr></tbody></table></div><!--[if mso | IE]>
                  </td><td style="vertical-align:top;width:300px;">
                  <![endif]--><div class="mj-column-per-50 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:300px;"><img alt="" height="auto" src="" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="300"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="center"><div style="cursor:auto;color:#333333;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:14px;line-height:18px;text-align:center;"><!-- text --></div></td></tr></tbody></table></div><!--[if mso | IE]>
                  </td></tr></table>
                  <![endif]--></td></tr></tbody></table></div>`
    },
    'triple-icons': {
      type: 'triple-icons',
      sort: 17,
      element: {
        type: 'triple-icons',
        icon: '&#xE165;',
        primary_head: 'builder_triple-icons',
        second_head: 'builder_triple-icons_comment'
      },
      defaultOptions: {
      },
      template: `<div style="margin:0px auto;max-width:600px;" data-class=""><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;"><!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:top;width:200px;">
                  <![endif]--><div class="mj-column-per-33 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:200px;"><img alt="" height="auto" src="" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="200"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="center"><div style="cursor:auto;color:#333333;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:14px;line-height:18px;text-align:center;"><!-- text --></div></td></tr></tbody></table></div><!--[if mso | IE]>
                  </td><td style="vertical-align:top;width:200px;">
                  <![endif]--><div class="mj-column-per-33 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:200px;"><img alt="" height="auto" src="" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="200"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="center"><div style="cursor:auto;color:#333333;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:14px;line-height:18px;text-align:center;"><!-- text --></div></td></tr></tbody></table></div><!--[if mso | IE]>
                  </td><td style="vertical-align:top;width:200px;">
                  <![endif]--><div class="mj-column-per-33 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:200px;"><img alt="" height="auto" src="" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="200"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="center"><div style="cursor:auto;color:#333333;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:14px;line-height:18px;text-align:center;"><!-- text --></div></td></tr></tbody></table></div><!--[if mso | IE]>
                  </td></tr></table>
                  <![endif]--></td></tr></tbody></table></div>`
    },
    'quadruple-icons': {
      type: 'quadruple-icons',
      sort: 18,
      element: {
        type: 'quadruple-icons',
        icon: '&#xE165;',
        primary_head: 'builder_quadruple-icons',
        second_head: 'builder_quadruple-icons_comment'
      },
      defaultOptions: {
      },
      template: `<div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;"><!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align:top;width:150px;">
                    <![endif]--><div class="mj-column-per-25 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:150px;"><img alt="" height="auto" src="" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="150"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="center"><div style="cursor:auto;color:#333333;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:14px;line-height:18px;text-align:center;"><!-- text --></div></td></tr></tbody></table></div><!--[if mso | IE]>
                    </td><td style="vertical-align:top;width:150px;">
                    <![endif]--><div class="mj-column-per-25 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:150px;"><img alt="" height="auto" src="" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="150"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="center"><div style="cursor:auto;color:#333333;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:14px;line-height:18px;text-align:center;"><!-- text --></div></td></tr></tbody></table></div><!--[if mso | IE]>
                    </td><td style="vertical-align:top;width:150px;">
                    <![endif]--><div class="mj-column-per-25 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:150px;"><img alt="" height="auto" src="" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="150"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="center"><div style="cursor:auto;color:#333333;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:14px;line-height:18px;text-align:center;"><!-- text --></div></td></tr></tbody></table></div><!--[if mso | IE]>
                    </td><td style="vertical-align:top;width:150px;">
                    <![endif]--><div class="mj-column-per-25 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:150px;"><img alt="" height="auto" src="" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="150"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="center"><div style="cursor:auto;color:#333333;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:14px;line-height:18px;text-align:center;"><!-- text --></div></td></tr></tbody></table></div><!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]--></td></tr></tbody></table></div><!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">
                      <tr>
                        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]--><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;"><!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align:top;width:150px;">
                    <![endif]--><div class="mj-column-per-25 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:150px;"><img alt="" height="auto" src="" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="150"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="center"><div style="cursor:auto;color:#333333;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:14px;line-height:18px;text-align:center;"><!-- text --></div></td></tr></tbody></table></div><!--[if mso | IE]>
                    </td><td style="vertical-align:top;width:150px;">
                    <![endif]--><div class="mj-column-per-25 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:150px;"><img alt="" height="auto" src="" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="150"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="center"><div style="cursor:auto;color:#333333;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:14px;line-height:18px;text-align:center;"><!-- text --></div></td></tr></tbody></table></div><!--[if mso | IE]>
                    </td><td style="vertical-align:top;width:150px;">
                    <![endif]--><div class="mj-column-per-25 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:150px;"><img alt="" height="auto" src="" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="150"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="center"><div style="cursor:auto;color:#333333;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:14px;line-height:18px;text-align:center;"><!-- text --></div></td></tr></tbody></table></div><!--[if mso | IE]>
                    </td><td style="vertical-align:top;width:150px;">
                    <![endif]--><div class="mj-column-per-25 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:150px;"><img alt="" height="auto" src="" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="150"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="center"><div style="cursor:auto;color:#333333;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:14px;line-height:18px;text-align:center;"><!-- text --></div></td></tr></tbody></table></div><!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]--></td></tr></tbody></table></div>`
    },
    'image-full_width': {
      type: 'image-full_width',
      sort: 19,
      element: {
        type: 'image-full_width',
        icon: '&#xE165;',
        primary_head: 'builder_image-full_width',
        second_head: 'builder_image-full_width_comment'
      },
      defaultOptions: {
      },
      template: `<div style="margin:0px auto;max-width:600px;" data-class=""><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;"><!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:top;width:600px;">
                  <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:580px;"><img alt="" height="auto" src="" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="580"></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]>
                  </td></tr></table>
                  <![endif]--></td></tr></tbody></table></div>`
    },
    'subtitle': {
      type: 'subtitle',
      sort: 20,
      element: {
        type: 'subtitle',
        icon: '&#xE165;',
        primary_head: 'builder_subtitle',
        second_head: 'builder_subtitle_comment'
      },
      defaultOptions: {
      },
      template: `<div style="margin:0px auto;max-width:600px;" data-class=""><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;"><!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:top;width:600px;">
                  <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="center"><div style="cursor:auto;color:;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:16px;font-weight:bold;line-height:22px;text-align:center;"><!-- text --></div></td></tr></tbody></table></div><!--[if mso | IE]>
                  </td></tr></table>
                  <![endif]--></td></tr></tbody></table></div>`
    },
    'text-content': {
      type: 'text-content',
      sort: 21,
      element: {
        type: 'text-content',
        icon: '&#xE165;',
        primary_head: 'builder_text-content',
        second_head: 'builder_text-content_comment'
      },
      defaultOptions: {
      },
      template: `<div style="margin:0px auto;max-width:600px;" data-class=""><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;"><!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:top;width:600px;">
                  <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="center"><div style="cursor:auto;color:#333333;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:14px;line-height:18px;text-align:center;"><!-- text --></div></td></tr></tbody></table></div><!--[if mso | IE]>
                  </td></tr></table>
                  <![endif]--></td></tr></tbody></table></div>`
    },
    'text-cta-with_border': {
      type: 'text-cta-with_border',
      sort: 22,
      element: {
        type: 'text-cta-with_border',
        icon: '&#xE165;',
        primary_head: 'builder_text-cta-with_border',
        second_head: 'builder_text-cta-with_border_comment'
      },
      defaultOptions: {
      },
      template: `<div style="margin:0px auto;max-width:600px;" data-class=""><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;border:5px solid #E1E1E1;direction:ltr;font-size:0px;padding:0px;"><!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:top;width:600px;">
                  <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:600px;"><img alt="" height="auto" src="" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="600"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="center"><div style="cursor:auto;color:#333333;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:14px;line-height:18px;text-align:center;"><!-- text --></div></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;" align="center" border="0"><tbody><tr><td style="border:none;border-radius:0px;color:;cursor:auto;padding:15px 30px;" align="center" valign="middle" bgcolor=""><p style="text-decoration:none;background:;color:;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:16px;font-weight:bold;line-height:120%;text-transform:uppercase;margin:0px;"><!-- button --></p></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]>
                  </td></tr></table>
                  <![endif]--></td></tr></tbody></table></div>`
    },
    'title-content': {
      type: 'title-content',
      sort: 23,
      element: {
        type: 'title-content',
        icon: '&#xE165;',
        primary_head: 'builder_title-content',
        second_head: 'builder_title-content_comment'
      },
      defaultOptions: {
      },
      template: `<div style="margin:0px auto;max-width:600px;" data-class=""><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;"><!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:top;width:600px;">
                  <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="center"><div style="cursor:auto;color:;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:20px;font-weight:bold;line-height:26px;text-align:center;text-transform:uppercase;"><!-- text --></div></td></tr></tbody></table></div><!--[if mso | IE]>
                  </td></tr></table>
                  <![endif]--></td></tr></tbody></table></div>
                  `
    },
    'mentions-legales': {
      type: 'mentions-legales',
      sort: 24,
      element: {
        type: 'mentions-legales',
        icon: '&#xE165;',
        primary_head: 'builder_mentions-legales',
        second_head: 'builder_mentions-legales_comment'
      },
      defaultOptions: {
      },
      template: `<div style="margin:0px auto;max-width:600px;" data-class=""><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:15px 0px 0px 0px;"><!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:top;width:600px;">
                  <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 10px;" align="left"><div style="cursor:auto;color:#939393;font-family:Arial, Ubuntu, Helvetica, sans-serif;font-size:11px;line-height:13px;text-align:left;"><!-- text --></div></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:15px 5px;" align="left"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="left" border="0"><tbody><tr><td style="width:25px;"><img alt="" height="auto" src="http://www.probtp.com/event/upload/docs/image/png/2017-02/logo-triman-gris.png" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="25"></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]>
                  </td></tr></table>
                  <![endif]--></td></tr></tbody></table></div>
                  `
    },
    'frise': {
      type: 'frise',
      sort: 25,
      element: {
        type: 'frise',
        icon: '&#xE165;',
        primary_head: 'builder_frise',
        second_head: 'builder_frise_comment'
      },
      defaultOptions: {
      },
      template: `<div style="margin:0px auto;max-width:600px;" data-class=""><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;padding-top:40px;"><!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:top;width:600px;">
                  <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:580px;"><img alt="" height="auto" src="" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="580"></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]>
                  </td></tr></table>
                  <![endif]--></td></tr></tbody></table></div><!--[if mso | IE]>
                  </td></tr></table>
                  <![endif]-->
                  <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">
                    <tr>
                      <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                  <![endif]--><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;"><!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:top;width:600px;">
                  <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;"><div style="font-size:1px;line-height:10px;white-space:nowrap;"> </div></td></tr></tbody></table></div><!--[if mso | IE]>
                  </td></tr></table>
                  <![endif]--></td></tr></tbody></table></div>
                  `
    },
    'title': {
      type: 'title',
      sort: 1,
      element: {
        type: 'title',
        icon: '&#xE165;',
        primary_head: 'builder_el_title',
        second_head: 'builder_el_title_comment'
      },
      defaultOptions: {
        align: 'center',
        title: 'Enter your title here',
        subTitle: 'Subtitle',
        padding: ["30px", "15px", "30px", "15px"],
        backgroundColor: '#fff',
        font: {
          weight: 'normal',
          weightOptions: ['bold', 'bolder', 'lighter', 'inherit', 'initial', 'normal', 100, 200, 300, 400, 500, 600, 700, 800, 900],
          family: 'Arial, Helvetica, sans-serif',
          familyOptions: defaultFontFamily
        },
        color: '#444444'
      },
      template: '<table class="main" width="100%" cellspacing="0" cellpadding="0" border="0" align="center" style="display: table; background-color: {{ element.options.backgroundColor }}" data-type="title">\n    <tbody>\n    <tr>\n        <td align="{{  element.options.align  }}" class="title" style="padding:{{  element.options.padding | arrToPadding   }}; color: #757575;" data-block-id="background">\n            <h1 style="font-family: {{ element.options.font.family }};font-weight:  {{ element.options.font.weight }}; margin: 0; color: {{ element.options.color }};" ng-if="element.options.title.length" data-block-id="main-title">{{  element.options.title  }}</h1>\n            <h4 style="font-family: {{ element.options.font.family }};font-weight: {{ element.options.font.weight }}; margin-bottom: 0; color: {{ element.options.color }};" ng-if="element.options.subTitle.length" data-block-id="sub-title">{{  element.options.subTitle  }}</h4>\n        </td>\n    </tr>\n    </tbody>\n</table>'
    },
    'button': {
      type: 'button',
      sort: 4,
      element: {
        type: 'button',
        icon: '&#xE913;',
        primary_head: 'builder_el_button',
        second_head: 'builder_el_button_comment'
      },
      defaultOptions: {
        align: 'center',
        padding: ['12px', '20px', '12px', '20px'],
        margin: ['15px', '15px', '15px', '15px'],
        buttonText: 'Click me',
        url: '#',
        buttonBackgroundColor: '#3498DB',
        backgroundColor: '#ffffff',
        border: {
          size: 1,
          radius: 3,
          color: '#3498DB',
          style: 'solid',
          styleOptions: ['dotted', 'solid', 'dashed']
        },
        fullWidth: false,
        font: {
          size: 15,
          color: '#ffffff',
          weight: 'normal',
          weightOptions: ['bold', 'bolder', 'lighter', 'inherit', 'initial', 'normal', 100, 200, 300, 400, 500, 600, 700, 800, 900],
          family: 'inherit',
          familyOptions: defaultFontFamily
        }
      },
      template: '<table class="main" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#FFFFFF" align="center" style="display: table; background-color: {{element.options.backgroundColor}};" data-type="button">\n    <tbody>\n    <tr>\n        <td class="buttons-full-width">\n            <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="text-align: {{ element.options.align }}" class="button">\n                <tbody>\n                <tr>\n                    <td class="button" style="padding: {{element.options.margin | arrToPadding}};">\n                        <a style="background-color: {{element.options.buttonBackgroundColor}};color: {{element.options.font.color}};font-family: {{element.options.font.family}};font-size: {{element.options.font.size}}px;line-height:19px;display: {{element.options.fullWidth ? \'block\' : \'inline-block\'}};border-radius: {{element.options.border.radius}}px;border: {{element.options.border.size}}px  {{element.options.border.style}}  {{element.options.border.color}};text-align: center;text-decoration: none;font-weight:  {{element.options.font.weight}};margin: 0; width: auto; padding: {{element.options.padding | arrToPadding}};" class="button-1" href="{{ element.options.url }}" data-default="1">{{ element.options.buttonText }}</a>                   <!--[if mso]>             </center>           </v:roundrect>         <![endif]-->\n                    </td>\n                </tr>\n                </tbody>\n            </table>\n        </td>\n    </tr>\n    </tbody>\n</table>'
    },
    'text': {
      type: 'text',
      sort: 2,
      element: {
        type: 'text',
        icon: '&#xE8EE;',
        primary_head: 'builder_el_text',
        second_head: 'builder_el_text_comment'
      },
      defaultOptions: {
        padding: ['10px', '15px', '10px', '15px'],
        backgroundColor: '#ffffff',
        font: {
          family: 'inherit',
          familyOptions: defaultFontFamily
        },
        text: '<p style="margin: 0">Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>'
      },
      template: '<table class="main" width="100%" cellspacing="0" cellpadding="0" border="0" style="display: table; background-color: {{element.options.backgroundColor}}" align="center" data-type="text-block">\n    <tbody>\n    <tr>\n        <td class="block-text" data-block-id="background" data-clonable="true" align="left" style="padding:{{element.options.padding | arrToPadding}}; font-size: 13px; color: #000000; line-height: 20px;font-family: {{element.options.font.family}}"\n      ui-tinymce="tinymceOptions"    ng-model="element.options.text">\n        </td>\n    </tr>\n    </tbody>\n</table>'
    },
    'social': {
      type: 'social',
      sort: 10,
      element: {
        type: 'social',
        icon: 'share',
        primary_head: 'social_icons',
        second_head: 'social_icons_comment'
      },
      defaultOptions: {
        align: 'center',
        padding: ['10px', '15px', '10px', '15px'],
        backgroundColor: '#eeeeee',
        links: {
          facebook: {
            link: 'https://www.facebook.com/envato',
            active: true
          },
          twitter: {
            link: 'https://twitter.com/envatomarket',
            active: true
          },
          linkedin: {
            link: '',
            active: false
          },
          youtube: {
            link: 'https://www.youtube.com/user/Envato',
            active: true
          }
        }
      },
      template: '<table class="main" align="center" width="100%" cellspacing="0" cellpadding="0" border="0" ng-style="{backgroundColor: element.options.backgroundColor}" style="display: table;" data-type="social-links">\n    <tbody>\n    <tr>\n        <td class="social" align="{{element.options.align}}" style="padding: {{ element.options.padding | arrToPadding  }}">\n            <a href="{{element.options.links.facebook.link}}" target="_blank" style="border: none;text-decoration: none;" class="facebook">\n                <img border="0" ng-if="element.options.links.facebook.active" src="assets/imgs/social/facebook.png">\n            </a>\n            <a href="{{element.options.links.twitter.link}}" target="_blank" style="border: none;text-decoration: none;" class="twitter">\n                <img border="0" ng-if="element.options.links.twitter.active" src="assets/imgs/social/twitter.png">\n            </a>\n            <a href="{{element.options.links.linkedin.link}}" target="_blank" style="border: none;text-decoration: none;" class="linkedin">\n                <img border="0" ng-if="element.options.links.linkedin.active" src="assets/imgs/social/linkedin.png">\n            </a>\n            <a href="{{element.options.links.youtube.link}}" target="_blank" style="border: none;text-decoration: none;" class="youtube">\n                <img border="0" ng-if="element.options.links.youtube.active" src="assets/imgs/social/youtube.png">\n            </a>\n        </td>\n    </tr>\n    </tbody>\n</table>'
    },
    'divider': {
      type: 'divider',
      sort: 3,
      element: {
        type: 'divider',
        icon: '&#xE8E9;',
        primary_head: 'builder_el_divider',
        second_head: 'builder_el_divider_comment'
      },
      defaultOptions: {
        padding: ['15px', '15px', '15px', '15px'],
        backgroundColor: '#ffffff',
        border: {
          size: 1,
          style: 'solid',
          styleOptions: ['solid', 'dashed', 'dotted'],
          color: '#DADFE1'
        }
      },
      template: '<table class="main" width="100%" style="border: 0; display: table; background-color: {{element.options.backgroundColor}};" cellspacing="0" cellpadding="0" border="0" align="center" data-type="divider">\n    <tbody>\n    <tr>\n        <td class="divider-simple" style="padding: {{ element.options.padding | arrToPadding  }};">\n            <table width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top: {{element.options.border.size}}px {{element.options.border.style}} {{element.options.border.color}};">\n                <tbody>\n                <tr>\n                    <td width="100%"></td>\n                </tr>\n                </tbody>\n            </table>\n        </td>\n    </tr>\n    </tbody>\n</table>'
    },
    'image': {
      type: 'image',
      sort: 5,
      element: {
        type: 'image',
        icon: '&#xE40B;',
        primary_head: 'builder_el_image',
        second_head: 'builder_el_image_comment'
      },
      defaultOptions: {
        align: 'center',
        padding: ["15px", "15px", "15px", "15px"],
        image: 'assets/imgs/350x150.jpg',
        width: '370',
        backgroundColor: '#ffffff',
        altTag: '',
        linkTo: {
          type: 'none',
          typeOptions: ['link', 'email', 'none'],
          link: ''
        }
      },
      template: '<table width="100%" class="main" cellspacing="0" cellpadding="0" border="0" align="center" style="display: table; background-color: {{element.options.backgroundColor}};" data-type="image">\n    <tbody>\n    <tr>\n        <td align="{{ element.options.align }}" style="padding: {{ element.options.padding | arrToPadding  }};" class="image">\n          <img border="0" align="one_image" image-with-link link="element.options.linkTo" style="display:block;max-width:100%;" ng-style="{width: element.options.width}" alt="{{element.options.altTag}}" ng-src="{{ element.options.image }}" tabindex="0">       </td>\n    </tr>\n    </tbody>\n</table>'
    },
    'imageTextRight': {
      type: 'imageTextRight',
      sort: 6,
      element: {
        type: 'imageTextRight',
        icon: 'format_textdirection_l_to_r',
        primary_head: 'builder_el_image_text_right',
        second_head: 'builder_el_image_text_right_comment'
      },
      defaultOptions: {
        padding: ["15px", "15px", "15px", "15px"],
        image: 'assets/imgs/340x145.jpg',
        width: '340',
        backgroundColor: '#ffffff',
        altTag: '',
        linkTo: {
          type: 'none',
          typeOptions: ['link', 'email', 'none'],
          link: ''
        },
        text: '<p style="line-height: 20px;margin:0">Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.</p>'
      },
      template: `<table class="main" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="{{element.options.backgroundColor}}" align="center">
                  <tbody>
                    <tr style="padding: {{ element.options.padding | arrToPadding }}; display: table-cell; font-family: Arial; font-size: 13px; color: #000000; line-height: 20px;">
                      <td width="295">
                        <img image-with-link link="element.options.linkTo" border="0" ng-src="{{ element.options.image }}" width="{{ element.options.width }}" style="display: block;margin: 0px;max-width: 100%;padding:0;">
                      </td>
                      <td width="10"></td>
                      <td width="295" valign="top" ui-tinymce="tinymceOptions" ng-model="element.options.text"></td>
                    </tr>
                  </tbody>
                </table>`
    },
    'imageTextLeft': {
      type: 'imageTextLeft',
      sort: 7,
      element: {
        type: 'imageTextLeft',
        icon: 'format_textdirection_r_to_l',
        primary_head: 'builder_el_image_text_left',
        second_head: 'builder_el_image_text_left_comment'
      },
      defaultOptions: {
        padding: ["15px", "15px", "15px", "15px"],
        image: 'assets/imgs/340x145.jpg',
        width: '340',
        backgroundColor: '#ffffff',
        altTag: '',
        linkTo: {
          type: 'none',
          typeOptions: ['link', 'email', 'none'],
          link: ''
        },
        text: '<p style="line-height: 20px;margin:0"">Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.</p>'
      },
      template: `<table class="main" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="{{element.options.backgroundColor}}" align="center">
                    <tbody>
                      <tr style="padding: {{ element.options.padding | arrToPadding }}; display: table-cell; font-family: Arial; font-size: 13px; color: #000000; line-height: 20px;">
                        <td width="295" valign="top" ui-tinymce="tinymceOptions" ng-model="element.options.text"></td>
                        <td width="10px"></td>
                        <td width="295">
                          <img image-with-link link="element.options.linkTo" border="0" ng-src="{{ element.options.image }}" width="{{ element.options.width }}" style="display: block;margin: 0px;max-width: 100%;padding:0;">
                        </td>
                      </tr>
                    </tbody>
                  </table>`
    },
    'imageText2x2': {
      type: 'imageText2x2',
      sort: 8,
      element: {
        type: 'imageText2x2',
        icon: 'text_fields',
        primary_head: 'builder_el_image_text_2x2',
        second_head: 'builder_el_image_text_2x2_comment'
      },
      defaultOptions: {
        padding: ["15px", "15px", "15px", "15px"],
        image1: 'assets/imgs/255x154.jpg',
        image2: 'assets/imgs/255x154.jpg',
        width1: '255',
        width2: '255',
        backgroundColor: '#ffffff',
        altTag1: '',
        altTag2: '',
        linkTo1: {
          type: 'none',
          typeOptions: ['link', 'email', 'none'],
          link: ''
        },
        linkTo2: {
          type: 'none',
          typeOptions: ['link', 'email', 'none'],
          link: ''
        },
        text1: '<p style="line-height: 20px;margin:0"">Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>',
        text2: '<p style="line-height: 20px;margin:0"">Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>'
      },
      template: `<table class="main" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="{{element.options.backgroundColor}}" align="center" data-type="imageText2x2Template">
                    <tbody style="display: table-cell;padding: {{ element.options.padding | arrToPadding }}">
                      <tr>
                        <td width="295" style="padding-left: 5px;"> 
                          <img image-with-link link="element.options.linkTo1" ng-src="{{ element.options.image1 }}" width="{{ element.options.width1 }}" alt="{{element.options.altTag1}}" style="max-width: 100%" border="0">
                        </td>
                        <td width="10"></td>
                        <td width="295" style="padding-right: 5px;"> 
                          <img image-with-link link="element.options.linkTo2" ng-src="{{ element.options.image2 }}" width="{{ element.options.width2 }}" alt="{{element.options.altTag2}}" style="max-width: 100%" border="0">                
                        </td>
                      </tr>
                      <tr>
                        <td width="295" align="left" style="font-family: Arial;font-size: 13px;color: #000000;line-height: 20px;padding-left: 5px;" ui-tinymce="tinymceOptions" ng-model="element.options.text1"></td>
                        <td width="10"></td>
                        <td width="295" align="left" style="font-family: Arial;font-size: 13px;color: #000000;line-height: 20px;padding-right: 5px;" ui-tinymce="tinymceOptions" ng-model="element.options.text2"></td>
                      </tr>
                    </tbody>
                  </table>`
    },
    'imageText3x2': {
      type: 'imageText3x2',
      sort: 9,
      element: {
        type: 'imageText3x2',
        icon: 'wrap_text',
        primary_head: 'builder_el_image_text_3x2',
        second_head: 'builder_el_image_text_3x2_comment'
      },
      defaultOptions: {
        padding: ["15px", "15px", "15px", "15px"],
        image1: 'assets/imgs/154x160.jpg',
        image2: 'assets/imgs/154x160.jpg',
        image3: 'assets/imgs/154x160.jpg',
        width1: '154',
        width2: '154',
        width3: '154',
        backgroundColor: '#ffffff',
        altTag1: '',
        altTag2: '',
        altTag3: '',
        linkTo1: {
          type: 'none',
          typeOptions: ['link', 'email', 'none'],
          link: ''
        },
        linkTo2: {
          type: 'none',
          typeOptions: ['link', 'email', 'none'],
          link: ''
        },
        linkTo3: {
          type: 'none',
          typeOptions: ['link', 'email', 'none'],
          link: ''
        },
        text1: '<p style="line-height: 20px;margin:0"">Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>',
        text2: '<p style="line-height: 20px;margin:0"">Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>',
        text3: '<p style="line-height: 20px;margin:0"">Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>'
      },
      template: `<table width="100%" class="main" cellspacing="0" cellpadding="0" border="0" bgcolor="{{element.options.backgroundColor}}" align="center" data-type="imageText3x2">
                    <tbody>
                      <tr>
                        <td valign="top" width="100%">
                          <div style="display: flex; padding: {{ element.options.padding | arrToPadding }};">
                            <div style="flex: 1 1 100%; display: flex; flex-direction: column;padding: 0 3px;">
                              <img style="max-width: 100%; padding-bottom: 3px;display: block;margin: 0 auto;" image-with-link link="element.options.linkTo1" ng-src="{{ element.options.image1 }}" width="{{ element.options.width1 }}" alt="{{element.options.altTag1}}" border="0">
                              <div style="font-family: Arial, serif; font-size: 13px; color: #000000; line-height: 20px" ui-tinymce="tinymceOptions" ng-model="element.options.text1"></div>
                            </div>
                            <div style="flex: 1 1 100%; display: flex; flex-direction: column;padding: 0 3px;">
                              <img style="max-width: 100%; padding-bottom: 3px;display: block;margin: 0 auto;" image-with-link link="element.options.linkTo2" ng-src="{{ element.options.image2 }}" width="{{ element.options.width2 }}" alt="{{element.options.altTag2}}" border="0">
                              <div style="font-family: Arial, serif; font-size: 13px; color: #000000; line-height: 20px" ui-tinymce="tinymceOptions" ng-model="element.options.text2"></div>
                            </div>
                            <div style="flex: 1 1 100%; display: flex; flex-direction: column;padding: 0 3px;">
                              <img style="max-width: 100%; padding-bottom: 3px;display: block;margin: 0 auto;" image-with-link link="element.options.linkTo3" ng-src="{{ element.options.image3 }}" width="{{ element.options.width3 }}" alt="{{element.options.altTag3}}" border="0">
                              <div style="font-family: Arial, serif; font-size: 13px; color: #000000; line-height: 20px" ui-tinymce="tinymceOptions" ng-model="element.options.text3"></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>`
    }
  }
};

// In case of require()
if (typeof module !== 'undefined') {
  module.exports = emailBuilderConfigurations;
}