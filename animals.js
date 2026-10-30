"use strict";

window.FarmAnimals = (() => {
  const common = {
    cow: `
      <path d="M214 285 Q190 250 207 215 L183 177 L237 198
        Q305 175 375 198 L427 177 L405 220 Q424 258 396 292"/>
      <path d="M225 275 Q184 260 170 222 Q167 204 188 208 L225 241"/>
      <path d="M385 275 Q426 260 440 222 Q443 204 422 208 L385 241"/>
      <ellipse cx="305" cy="383" rx="116" ry="105"/>
      <path d="M218 355 Q229 316 263 332 Q285 351 254 377 Q230 385 218 355 Z"/>
      <path d="M338 398 Q359 357 388 377 Q409 403 376 428 L342 425 Z"/>
      <ellipse cx="305" cy="406" rx="65" ry="43"/>
      <ellipse cx="284" cy="402" rx="7" ry="10" fill="#222"/>
      <ellipse cx="326" cy="402" rx="7" ry="10" fill="#222"/>
      <path d="M284 422 Q305 438 326 422" fill="none"/>
      <ellipse cx="263" cy="303" rx="12" ry="16"/>
      <ellipse cx="347" cy="303" rx="12" ry="16"/>
      <ellipse cx="265" cy="305" rx="5" ry="8" fill="#222"/>
      <ellipse cx="345" cy="305" rx="5" ry="8" fill="#222"/>
      <path d="M284 274 Q305 289 326 274"/>
      <path d="M240 472 L238 510 L278 510 L280 472
        M330 472 L332 510 L372 510 L369 472"/>
      <path d="M390 355 Q435 350 429 322 Q424 306 443 311"/>
      <path d="M220 510 L285 510 M325 510 L390 510"/>
    `,
    chick: `
      <path d="M220 419 Q190 390 207 349 Q214 327 236 316
        Q234 260 275 231 Q317 202 355 234
        Q383 255 382 302 Q416 326 410 368
        Q405 408 372 425 Q310 449 254 428 Z"/>
      <path d="M270 244 Q247 214 269 198 Q290 194 303 226
        Q323 190 344 207 Q361 225 339 250"/>
      <ellipse cx="278" cy="317" rx="8" ry="11" fill="#222"/>
      <ellipse cx="345" cy="317" rx="8" ry="11" fill="#222"/>
      <path d="M294 338 L313 354 L333 338 Q313 327 294 338 Z"/>
      <path d="M268 372 Q285 390 301 372 M328 372 Q345 390 362 372" fill="none"/>
      <path d="M253 416 L249 475 L290 475 L298 425
        M333 425 L341 475 L382 475 L371 416"/>
      <path d="M249 475 L230 486 L283 486
        M341 475 L330 486 L382 486"/>
      <path d="M226 360 Q197 337 194 319 Q219 319 244 350
        M393 350 Q418 322 438 333 Q438 358 401 374"/>
    `,
    pig: `
      <path d="M230 285 L210 217 Q208 195 231 208 L273 251
        Q308 237 348 251 L390 208 Q412 195 410 217 L390 285
        Q419 319 409 367 Q401 408 367 430 L365 480 L330 480
        L324 439 L281 439 L275 480 L240 480 L239 429
        Q204 405 199 366 Q194 318 230 285 Z"/>
      <path d="M246 268 Q230 238 228 218
        M374 268 Q390 238 392 218" fill="none"/>
      <ellipse cx="305" cy="362" rx="72" ry="54"/>
      <ellipse cx="283" cy="352" rx="7" ry="10" fill="#222"/>
      <ellipse cx="333" cy="352" rx="7" ry="10" fill="#222"/>
      <ellipse cx="305" cy="393" rx="40" ry="26"/>
      <ellipse cx="291" cy="392" rx="5" ry="8" fill="#222"/>
      <ellipse cx="319" cy="392" rx="5" ry="8" fill="#222"/>
      <path d="M277 300 Q305 318 333 300"/>
      <path d="M407 381 Q446 374 439 350 Q434 336 451 337" fill="none"/>
    `,
    lamb: `
      <circle cx="242" cy="293" r="37"/>
      <circle cx="287" cy="264" r="42"/>
      <circle cx="332" cy="263" r="42"/>
      <circle cx="373" cy="292" r="36"/>
      <circle cx="226" cy="337" r="39"/>
      <circle cx="382" cy="338" r="39"/>
      <ellipse cx="305" cy="369" rx="105" ry="90"/>
      <circle cx="262" cy="311" r="38"/>
      <circle cx="305" cy="292" r="43"/>
      <circle cx="349" cy="312" r="38"/>
      <ellipse cx="305" cy="358" rx="61" ry="66"/>
      <ellipse cx="282" cy="347" rx="7" ry="10" fill="#222"/>
      <ellipse cx="328" cy="347" rx="7" ry="10" fill="#222"/>
      <path d="M296 367 L305 375 L314 367
        M290 388 Q305 402 320 388" fill="none"/>
      <path d="M237 416 L235 474 L270 474 L274 424
        M335 424 L339 474 L374 474 L370 416"/>
      <path d="M235 474 L275 474 M339 474 L379 474"/>
      <path d="M245 326 Q222 321 214 343
        M365 326 Q388 321 396 343" fill="none"/>
    `,
    foal: `
      <path d="M235 300 Q202 267 226 222 L253 189
        L276 207 L269 263 Q307 239 343 259
        L380 236 L400 252 L382 292
        Q409 323 390 362 L365 383
        L363 467 L331 467 L326 385
        L280 385 L269 467 L238 467 L242 376
        Q211 346 235 300 Z"/>
      <path d="M251 218 Q244 188 261 174
        Q279 182 277 213" />
      <path d="M244 260 Q215 249 209 230
        M376 266 Q410 249 419 229" fill="none"/>
      <ellipse cx="269" cy="287" rx="7" ry="10" fill="#222"/>
      <ellipse cx="305" cy="287" rx="7" ry="10" fill="#222"/>
      <path d="M270 319 Q288 334 306 319" fill="none"/>
      <path d="M237 340 Q202 361 218 389
        M382 333 Q420 345 411 372" fill="none"/>
      <path d="M238 467 L273 467 M331 467 L367 467"/>
    `
  };

  const metadata = {
    cow: "Cute Baby Cow",
    chick: "Happy Little Chick",
    pig: "Sweet Piglet",
    lamb: "Fluffy Little Lamb",
    foal: "Baby Horse"
  };

  function getAnimal(id) {
    if (!Object.prototype.hasOwnProperty.call(common, id)) {
      throw new Error("Unknown animal selected.");
    }

    return {
      id,
      name: metadata[id],
      drawing: common[id]
    };
  }

  return { getAnimal, metadata };
})();
