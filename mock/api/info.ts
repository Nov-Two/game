import LangMap from '../lang'

// 开发时倒计时需显示：end_time 设为“当前 + 10 天 16 小时”，页面会显示 COUNTDOWN: 10D 16H
const getMockEndTime = () => Math.floor(Date.now() / 1000) + 10 * 24 * 3600 + 16 * 3600

export default {
  url: '/api/info',
  method: 'get',
  response: ({ query }) => {
    return {
      status: 'success',
      msg: '',
      data: {
        player: {
          uid: 10000021
        },
        event_config: {
          start_time: 1637824845,
          end_time: getMockEndTime(),
          region_lang: 'US',
          region: 'US',
          lang: query.lang || 'en',
          rule: `<h1>Heading 1 Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6</h6>
<p>Paragraph Paragraph Paragraph Paragraph Paragraph Paragraph Paragraph
Paragraph Paragraph Paragraph <a href="https://ff.garena.com/">Link</a> Paragraph Paragraph Paragraph Paragraph Paragraph</p>
<p>Paragraph Paragraph Paragraph Paragraph Paragraph Paragraph Paragraph
Paragraph Paragraph Paragraph <a href="https://ff.garena.com/">Link</a> Paragraph Paragraph Paragraph Paragraph Paragraph</p>
<h1>List Content 1</h1>
<hr/>
<ul>
  <li>List</li>
  <li>List<ul>
    <li>Sublist</li>
    <li>Sublist</li>
  </ul></li>
  <li>List</li>
  <li>
    <a href="https://ff.garena.com/">List</a>
  </li>
</ul>
<h1>List Content 2</h1>
<hr/>
<ol>
  <li>List</li>
  <li>List<ol>
    <li>Sublist</li>
    <li>Sublist</li>
  </ol></li>
  <li>List</li>
  <li>
    <a href="https://ff.garena.com/">List</a>
  </li>
</ol>
<blockquote>
  blockquote blockquote blockquote blockquote blockquote blockquote blockquote blockquote blockquote
</blockquote>
<strong>KeyWords</strong>
<em>KeyWords</em>
<em><strong>KeyWords</strong></em>
<code>code</code>
<center>Center</center>
<p align="left">left</p>
<p align="right">right</p>
<pre><code>CreateInternalHud(out var createdEntity entity&lt;Text&gt;, owner entity&lt;Player entity&gt;, hudType HUD type)</code></pre>
<pre><code class="language-tag">
    {
    "module_tag": [
        { "link": "/en/docs/module-2", "name": "Module 2", "hover": "Module Relate 2" }
      ]
    }
  </code></pre>
<pre><code class="language-block">{"type": "fnv","id": "W9wUSK:xk})=nX^MDvqa","extraState": [],"fields": {"N": "func1","R": "any"}}
</code></pre>
<img src="https://dl.dir.freefiremobile.com/common/web_event/official2.ff.garena.all/20248/e3f21ca0d97b9621f3ff513378e97cc0.jpg" />
<h1>Table</h1>
<hr />
<table>
<thead>
<tr>
  <th>Input parameter</th>
  <th>Parameter type</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td>Triggering player</td>
  <td><a href="https://ff.garena.com"><code>Module</code></a> <code>Module</code>Player</td>
  <td>The player who will trigger the incident</td>
</tr>
<tr>
  <td>Revival/help up method</td>
  <td>PlayerReviveSourceType</td>
  <td>The method by which a player is revived or helped up from being eliminated or knocked down</td>
</tr>
</tbody>
</table>`
        },
        policy_popup: {
          popup_title: 'TITLE',
          popup_content: `<h1>Heading 1 Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <h4>Heading 4</h4>
          <h5>Heading 5</h5>
          <h6>Heading 6</h6>
          <p>Paragraph Paragraph Paragraph Paragraph Paragraph Paragraph Paragraph
          Paragraph Paragraph Paragraph <a href="https://ff.garena.com/">Link</a> Paragraph Paragraph Paragraph Paragraph Paragraph</p>
          <p>Paragraph Paragraph Paragraph Paragraph Paragraph Paragraph Paragraph
          Paragraph Paragraph Paragraph <a href="https://ff.garena.com/">Link</a> Paragraph Paragraph Paragraph Paragraph Paragraph</p>
          <h1>List Content 1</h1>
          <hr/>
          <ul>
            <li>List</li>
            <li>List<ul>
              <li>Sublist</li>
              <li>Sublist</li>
            </ul></li>
            <li>List</li>
            <li>
              <a href="https://ff.garena.com/">List</a>
            </li>
          </ul>
          <h1>List Content 2</h1>
          <hr/>
          <ol>
            <li>List</li>
            <li>List<ol>
              <li>Sublist</li>
              <li>Sublist</li>
            </ol></li>
            <li>List</li>
            <li>
              <a href="https://ff.garena.com/">List</a>
            </li>
          </ol>
          <blockquote>
            blockquote blockquote blockquote blockquote blockquote blockquote blockquote blockquote blockquote
          </blockquote>
          <strong>KeyWords</strong>
          <em>KeyWords</em>
          <em><strong>KeyWords</strong></em>
          <code>code</code>
          <center>Center</center>
          <p align="left">left</p>
          <p align="right">right</p>
          <pre><code>CreateInternalHud(out var createdEntity entity&lt;Text&gt;, owner entity&lt;Player entity&gt;, hudType HUD type)</code></pre>
          <pre><code class="language-tag">
              {
              "module_tag": [
                  { "link": "/en/docs/module-2", "name": "Module 2", "hover": "Module Relate 2" }
                ]
              }
            </code></pre>
          <pre><code class="language-block">{"type": "fnv","id": "W9wUSK:xk})=nX^MDvqa","extraState": [],"fields": {"N": "func1","R": "any"}}
          </code></pre>
          <img src="https://dl.dir.freefiremobile.com/common/web_event/official2.ff.garena.all/20248/e3f21ca0d97b9621f3ff513378e97cc0.jpg" />
          <h1>Table</h1>
          <hr />
          <table>
          <thead>
          <tr>
            <th>Input parameter</th>
            <th>Parameter type</th>
            <th>Description</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Triggering player</td>
            <td><a href="https://ff.garena.com"><code>Module</code></a> <code>Module</code>Player</td>
            <td>The player who will trigger the incident</td>
          </tr>
          <tr>
            <td>Revival/help up method</td>
            <td>PlayerReviveSourceType</td>
            <td>The method by which a player is revived or helped up from being eliminated or knocked down</td>
          </tr>
          </tbody>
          </table>`,
          checked: false
        },
        google_analytics_popup: {
          popup_content: `<h1>Heading 1 Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <h4>Heading 4</h4>
          <h5>Heading 5</h5>
          <h6>Heading 6</h6>
          <p>Paragraph Paragraph Paragraph Paragraph Paragraph Paragraph Paragraph
          Paragraph Paragraph Paragraph <a href="https://ff.garena.com/">Link</a> Paragraph Paragraph Paragraph Paragraph Paragraph</p>
          <p>Paragraph Paragraph Paragraph Paragraph Paragraph Paragraph Paragraph
          Paragraph Paragraph Paragraph <a href="https://ff.garena.com/">Link</a> Paragraph Paragraph Paragraph Paragraph Paragraph</p>
          <h1>List Content 1</h1>
          <hr/>
          <ul>
            <li>List</li>
            <li>List<ul>
              <li>Sublist</li>
              <li>Sublist</li>
            </ul></li>
            <li>List</li>
            <li>
              <a href="https://ff.garena.com/">List</a>
            </li>
          </ul>
          <h1>List Content 2</h1>
          <hr/>
          <ol>
            <li>List</li>
            <li>List<ol>
              <li>Sublist</li>
              <li>Sublist</li>
            </ol></li>
            <li>List</li>
            <li>
              <a href="https://ff.garena.com/">List</a>
            </li>
          </ol>
          <blockquote>
            blockquote blockquote blockquote blockquote blockquote blockquote blockquote blockquote blockquote
          </blockquote>
          <strong>KeyWords</strong>
          <em>KeyWords</em>
          <em><strong>KeyWords</strong></em>
          <code>code</code>
          <center>Center</center>
          <p align="left">left</p>
          <p align="right">right</p>
          <pre><code>CreateInternalHud(out var createdEntity entity&lt;Text&gt;, owner entity&lt;Player entity&gt;, hudType HUD type)</code></pre>
          <pre><code class="language-tag">
              {
              "module_tag": [
                  { "link": "/en/docs/module-2", "name": "Module 2", "hover": "Module Relate 2" }
                ]
              }
            </code></pre>
          <pre><code class="language-block">{"type": "fnv","id": "W9wUSK:xk})=nX^MDvqa","extraState": [],"fields": {"N": "func1","R": "any"}}
          </code></pre>
          <img src="https://dl.dir.freefiremobile.com/common/web_event/official2.ff.garena.all/20248/e3f21ca0d97b9621f3ff513378e97cc0.jpg" />
          <h1>Table</h1>
          <hr />
          <table>
          <thead>
          <tr>
            <th>Input parameter</th>
            <th>Parameter type</th>
            <th>Description</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Triggering player</td>
            <td><a href="https://ff.garena.com"><code>Module</code></a> <code>Module</code>Player</td>
            <td>The player who will trigger the incident</td>
          </tr>
          <tr>
            <td>Revival/help up method</td>
            <td>PlayerReviveSourceType</td>
            <td>The method by which a player is revived or helped up from being eliminated or knocked down</td>
          </tr>
          </tbody>
          </table>`,
          storage_choice_text: '<p>choice 1</p>',
          ad_choice_text: '<p>choice 2</p>',
          checked: 0,
          choices: {
            ad_storage: 0,
            analytics_storage: 0,
            ad_user_data: 0,
            ad_personalization: 0
          }
        },
        transify: LangMap[query.lang] || LangMap['en'] || {},
        data_log_name: ''
      }
    }
  }
}
