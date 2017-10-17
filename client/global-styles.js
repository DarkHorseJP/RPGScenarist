import { injectGlobal } from 'styled-components'

/* eslint no-unused-expressions: 0 */
injectGlobal`
  a.thumbnail {
    overflow: hidden;
  }

  a:hover.thumbnail {
    overflow: visible;
  }

  div.dropdown-menu.suggestion {
    position: absolute;
    left: 0;
    width: calc(100% - 30px);
    margin: 0 15px;
  }

  .dropdown-menu.suggestion > ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .dropdown-menu.suggestion > ul > li {
    padding: 0 15px;
  }

  .dropdown-menu.suggestion > ul > li.active {
    background-color: #f5f5f5;
  }

  .suggestion > ul > li > span > mark {
    color: #ff0000;
    font-weight: bold;
    padding: inherit;
    background-color: inherit;
  }

  .audio-player .progress {
    height: 5px;
    margin: 0 0 5px;
    cursor: pointer;
  }

  .audio-player .progress-bar {
    transition: inherit;
  }
`
